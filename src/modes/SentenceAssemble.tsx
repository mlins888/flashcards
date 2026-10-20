import { useMemo, useRef, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { getVerb } from '../data/verbs';
import { hintFor, type Sentence } from '../data/sentences';
import { conjugate } from '../engine/conjugate';
import { activePersons, pickSentence, shuffle, verbDecoys, type PracticeSettings } from '../engine/generators';
import { answerFor, checkAssembly, chunksFor, fullSentence, toSentence } from '../engine/sentence';
import { PERSON_LABEL, TENSES, TENSE_LABEL, type Person, type Tense } from '../engine/types';
import { useApp } from '../state/store';
import { Card3D, CardText, type Vec3 } from '../three/Card3D';
import { CardTable } from '../three/CardTable';
import { SentenceRail } from '../three/SentenceRail';
import { NEUTRAL_RIM, TENSE_COLOR } from '../three/theme';
import { Feedback } from '../ui/Feedback';
import { ModeLayout } from '../ui/ModeLayout';
import { TenseChip } from '../ui/TenseToggle';
import { useNarrow } from '../ui/useNarrow';

const TILE_H = 0.95;
const GAP = 0.18;
const DECK: Vec3 = [8, 0, 4];
/** Gold rim marks every verb-form card, so you can see the choices at a glance. */
const VERB_RIM = '#e0b46a';
const DRAG_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

interface Tile {
  id: string;
  text: string;
  isVerbChoice: boolean;
  /** For verb cards: which person/tense this form actually is (for feedback). */
  form?: { person: Person; tense: Tense };
  width: number;
  yaw: number;
}

interface DragState {
  id: string;
  pos: Vec3;
  moved: boolean;
}

const tileWidth = (text: string) => Math.min(3.6, Math.max(1.15, 0.5 + text.length * 0.2));

/** Find a person/tense that produces this form, preferring active persons. */
function describeForm(verbInf: string, form: string, persons: Person[]): { person: Person; tense: Tense } | undefined {
  const verb = getVerb(verbInf);
  for (const tense of TENSES) for (const person of persons) if (conjugate(verb, tense, person) === form) return { person, tense };
  return undefined;
}

function buildTiles(s: Sentence, settings: PracticeSettings): Tile[] {
  const verb = getVerb(s.verb);
  const persons = activePersons(settings);
  const words: Omit<Tile, 'width' | 'yaw'>[] = chunksFor(s).map((c, i) => ({
    id: `w${i}`,
    text: c.text,
    isVerbChoice: c.isVerb,
    form: c.isVerb ? { person: s.person, tense: s.tense } : undefined,
  }));
  const decoys = verbDecoys(verb, s.tense, s.person, settings, 3).map((text, i) => ({
    id: `d${i}`,
    text,
    isVerbChoice: true,
    form: describeForm(s.verb, text, persons),
  }));
  return shuffle([...words, ...decoys]).map((t) => ({ ...t, width: tileWidth(t.text), yaw: (Math.random() - 0.5) * 0.12 }));
}

function newGame(settings: PracticeSettings, excludeId?: string, round = 0) {
  const sentence = pickSentence(settings, useApp.getState().srs, excludeId);
  return { sentence, tiles: buildTiles(sentence, settings), round };
}

function rowCount(tiles: Tile[], maxWidth: number): number {
  const pos = flow(tiles, maxWidth, 0);
  return new Set([...pos.values()].map((p) => p[2])).size || 1;
}

/** Lays tiles left-to-right in centered rows no wider than maxWidth. */
function flow(tiles: Tile[], maxWidth: number, z0: number): Map<string, Vec3> {
  const rows: Tile[][] = [[]];
  let w = 0;
  for (const t of tiles) {
    if (w > 0 && w + GAP + t.width > maxWidth) {
      rows.push([]);
      w = 0;
    }
    rows[rows.length - 1].push(t);
    w += (w > 0 ? GAP : 0) + t.width;
  }
  const out = new Map<string, Vec3>();
  rows.forEach((row, r) => {
    const rowW = row.reduce((n, t) => n + t.width, 0) + GAP * (row.length - 1);
    let x = -rowW / 2;
    for (const t of row) {
      out.set(t.id, [x + t.width / 2, 0, z0 + r * (TILE_H + GAP)]);
      x += t.width + GAP;
    }
  });
  return out;
}

export function SentenceAssemble() {
  const settings = useApp((s) => s.settings);
  const record = useApp((s) => s.record);
  const narrow = useNarrow();

  const [game, setGame] = useState(() => newGame(settings));
  const { sentence, tiles, round } = game;
  const [placed, setPlaced] = useState<string[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [status, setStatus] = useState<'building' | 'correct' | 'wrong' | 'revealed'>('building');
  const [attempted, setAttempted] = useState(false);
  const [shake, setShake] = useState(0);
  const dragStart = useRef<THREE.Vector3 | null>(null);

  const byId = useMemo(() => new Map(tiles.map((t) => [t.id, t])), [tiles]);
  const railTiles = placed.map((id) => byId.get(id)!).filter(Boolean);
  const handTiles = tiles.filter((t) => !placed.includes(t.id));

  // Table geometry is sized for the whole deal so the camera stays put while you play.
  const answerWidth = tiles.filter((t) => t.id.startsWith('w')).reduce((n, t) => n + t.width + GAP, 0);
  const maxRow = Math.min(narrow ? 6.2 : 10, Math.max(6, answerWidth + 1));
  const allRows = rowCount(tiles, maxRow);
  const railRows = Math.min(allRows, narrow ? 3 : 2);
  const railDepth = railRows * (TILE_H + GAP) + 0.35;
  const RAIL_Z = 0;
  const railUsed = railTiles.length ? rowCount(railTiles, maxRow - 0.4) : 1;
  const railPos = flow(railTiles, maxRow - 0.4, RAIL_Z - ((railUsed - 1) * (TILE_H + GAP)) / 2);
  const handZ = RAIL_Z + railDepth / 2 + 0.8;
  const handPos = flow(handTiles, maxRow, handZ);
  const top = RAIL_Z - railDepth / 2;
  const bottom = handZ + allRows * (TILE_H + GAP) - GAP;

  const locked = status === 'correct' || status === 'revealed';
  const words = railTiles.map((t) => t.text);

  const toggle = (id: string) => {
    if (locked) return;
    setStatus('building');
    setPlaced((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const drop = (id: string, pos: Vec3) => {
    if (locked) return;
    setStatus('building');
    const inRail = pos[2] < RAIL_Z + railDepth / 2 + 0.2;
    setPlaced((p) => {
      const rest = p.filter((x) => x !== id);
      if (!inRail) return rest;
      // Insert before the first rail card whose center is to the right of the drop point (same row).
      const idx = rest.findIndex((rid) => {
        const rp = railPos.get(rid);
        return rp && (rp[2] > pos[2] + TILE_H / 2 || (Math.abs(rp[2] - pos[2]) <= TILE_H / 2 + 0.1 && rp[0] > pos[0]));
      });
      return idx === -1 ? [...rest, id] : [...rest.slice(0, idx), id, ...rest.slice(idx)];
    });
  };

  // Pointer events can arrive faster than React re-renders, so the live drag lives in a ref.
  const dragRef = useRef<DragState | null>(null);
  const setDragBoth = (d: DragState | null) => {
    dragRef.current = d;
    setDrag(d);
  };

  const onDown = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    if (locked) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragStart.current = e.ray.intersectPlane(DRAG_PLANE, new THREE.Vector3());
    setDragBoth({ id, pos: railPos.get(id) ?? handPos.get(id)!, moved: false });
  };
  const onMove = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    const d = dragRef.current;
    if (!d || d.id !== id) return;
    const hit = e.ray.intersectPlane(DRAG_PLANE, new THREE.Vector3());
    if (!hit || !dragStart.current) return;
    setDragBoth({ id, pos: [hit.x, 0, hit.z], moved: d.moved || hit.distanceTo(dragStart.current) > 0.15 });
  };
  const onUp = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    const d = dragRef.current;
    if (!d || d.id !== id) return;
    (e.target as Element).releasePointerCapture(e.pointerId);
    if (d.moved) drop(id, d.pos);
    else toggle(id);
    setDragBoth(null);
  };

  const check = () => {
    if (!railTiles.length) return;
    const ok = checkAssembly(sentence, words);
    if (!attempted) {
      record(sentence.verb, sentence.tense, sentence.person, ok ? 'correct' : 'wrong');
      setAttempted(true);
    }
    setStatus(ok ? 'correct' : 'wrong');
    if (!ok) setShake((s) => s + 1);
  };

  const reveal = () => {
    if (!attempted) {
      record(sentence.verb, sentence.tense, sentence.person, 'wrong');
      setAttempted(true);
    }
    setPlaced(chunksFor(sentence).map((_, i) => `w${i}`));
    setStatus('revealed');
  };

  const next = () => {
    setGame(newGame(settings, sentence.id, round + 1));
    setPlaced([]);
    setStatus('building');
    setAttempted(false);
    setDragBoth(null);
  };

  const chosenVerb = railTiles.find((t) => t.isVerbChoice);
  const verbWrong = status === 'wrong' && chosenVerb && chosenVerb.id.startsWith('d');
  const answer = answerFor(sentence);

  return (
    <ModeLayout
      title="Build the sentence"
      subtitle="Drag (or tap) word cards into the rail. One verb card is right — the rest are decoys."
      stage={
        <CardTable fit={{ width: maxRow + 0.4, depth: bottom - top + 0.4, center: [0, 0, (top + bottom) / 2 - 0.2] }} label={`Word cards for: ${sentence.en}`}>
          <SentenceRail width={maxRow + 0.2} depth={railDepth} z={RAIL_Z} active={!!drag?.moved} empty={!railTiles.length} />
          {tiles.map((t, i) => {
            const dragging = drag?.id === t.id && drag.moved;
            const pos = dragging ? drag.pos : (railPos.get(t.id) ?? handPos.get(t.id) ?? [0, 0, 0]);
            const inRail = placed.includes(t.id);
            const tint =
              inRail && status === 'correct'
                ? 'correct'
                : inRail && (status === 'revealed' || (status === 'wrong' && t.isVerbChoice && verbWrong))
                  ? status === 'revealed'
                    ? 'almost'
                    : 'wrong'
                  : 'none';
            return (
              <Card3D
                key={`${round}-${t.id}`}
                position={pos}
                yaw={inRail || dragging ? 0 : t.yaw}
                width={t.width}
                height={TILE_H}
                accent={t.isVerbChoice ? (locked && inRail ? TENSE_COLOR[sentence.tense] : VERB_RIM) : NEUTRAL_RIM}
                raised={dragging}
                immediate={dragging}
                tint={tint}
                shake={inRail ? shake : 0}
                dealFrom={DECK}
                dealDelay={i * 70}
                onPointerDown={onDown(t.id)}
                onPointerMove={onMove(t.id)}
                onPointerUp={onUp(t.id)}
                front={
                  <CardText size={0.34} maxWidth={t.width - 0.15}>
                    {t.text}
                  </CardText>
                }
              />
            );
          })}
        </CardTable>
      }
    >
      <p className="english">“{sentence.en}”</p>

      <div className={`built ${words.length ? 'has' : ''}`} aria-live="polite">
        {words.length ? toSentence(words) : 'Your sentence will appear here…'}
      </div>

      <details>
        <summary className="muted">Tap-to-build list (keyboard friendly)</summary>
        <div className="chips" style={{ marginTop: 8 }}>
          {tiles.map((t) => (
            <button key={t.id} className="chip" aria-pressed={placed.includes(t.id)} onClick={() => toggle(t.id)} disabled={locked}>
              {placed.includes(t.id) ? '✓ ' : ''}
              {t.text}
            </button>
          ))}
        </div>
      </details>

      {status === 'wrong' && (
        <Feedback grade="wrong">
          {verbWrong && chosenVerb?.form ? (
            <>
              <b>{chosenVerb.text}</b> is {PERSON_LABEL[chosenVerb.form.person]} · {TENSE_LABEL[chosenVerb.form.tense].toLowerCase()}. This sentence needs{' '}
              {PERSON_LABEL[sentence.person]} · <TenseChip tense={sentence.tense} />
            </>
          ) : !chosenVerb ? (
            <>Don't forget the verb!</>
          ) : (
            <>Right verb — check the word order or missing words.</>
          )}
        </Feedback>
      )}

      {(status === 'correct' || status === 'revealed') && (
        <Feedback grade={status === 'correct' ? 'correct' : 'wrong'}>
          <p style={{ margin: 0 }}>
            <b>{fullSentence(sentence)}</b> <TenseChip tense={sentence.tense} />
          </p>
          <p className="hint">
            {answer} = {getVerb(sentence.verb).inf}, {PERSON_LABEL[sentence.person]}. {hintFor(sentence)}
          </p>
        </Feedback>
      )}

      <div className="row">
        {locked ? (
          <button className="btn primary" autoFocus onClick={next}>
            Next sentence →
          </button>
        ) : (
          <>
            <button className="btn primary" onClick={check} disabled={!railTiles.length}>
              Check
            </button>
            <button className="btn" onClick={() => setPlaced([])} disabled={!railTiles.length}>
              Clear
            </button>
            <button className="btn ghost" onClick={reveal}>
              Show answer
            </button>
          </>
        )}
      </div>
    </ModeLayout>
  );
}
