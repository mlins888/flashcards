import { useMemo, useRef, useState } from 'react';
import { VERBS, getVerb } from '../data/verbs';
import { conjugate } from '../engine/conjugate';
import { grade as gradeAnswer, type Grade } from '../engine/grade';
import { activePersons, activeTenses, pickGridVerb } from '../engine/generators';
import { PERSON_LABEL, PERSON_SHORT, TENSE_ES, type Person, type Tense } from '../engine/types';
import { useApp } from '../state/store';
import { Card3D, CardLabel, CardText, type Vec3 } from '../three/Card3D';
import { CardTable } from '../three/CardTable';
import { INK_SOFT, TENSE_COLOR } from '../three/theme';
import { AnswerInput, type AnswerInputHandle } from '../ui/AnswerInput';
import { Diff, Feedback } from '../ui/Feedback';
import { ModeLayout } from '../ui/ModeLayout';
import { TenseToggle } from '../ui/TenseToggle';
import { useNarrow } from '../ui/useNarrow';

const W = 2.6;
const H = 1.75;
const GAP = 0.35;
const DECK: Vec3 = [7, 0, 4];

interface Result {
  grade: Grade;
  given: string;
}

function layout(count: number, cols: number): { positions: Vec3[]; width: number; depth: number } {
  const rows = Math.ceil(count / cols);
  const width = cols * W + (cols - 1) * GAP;
  const depth = rows * H + (rows - 1) * GAP;
  const positions = Array.from({ length: count }, (_, i): Vec3 => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    // Center a short last row.
    const inRow = r === rows - 1 ? count - r * cols : cols;
    const rowWidth = inRow * W + (inRow - 1) * GAP;
    return [-rowWidth / 2 + W / 2 + c * (W + GAP), 0, -depth / 2 + H / 2 + r * (H + GAP)];
  });
  return { positions, width, depth };
}

export function GridDrill() {
  const settings = useApp((s) => s.settings);
  const srs = useApp((s) => s.srs);
  const record = useApp((s) => s.record);
  const narrow = useNarrow();

  const tenses = activeTenses(settings);
  const persons = activePersons(settings);
  const [tense, setTense] = useState<Tense>(tenses[0]);
  const [verbInf, setVerbInf] = useState(() => pickGridVerb(settings, srs, tenses[0]).inf);
  const [results, setResults] = useState<Partial<Record<Person, Result>>>({});
  const [active, setActive] = useState<Person>(persons[0]);
  const [input, setInput] = useState('');
  const [shakes, setShakes] = useState<Partial<Record<Person, number>>>({});
  const [round, setRound] = useState(0);
  const [lastAnswered, setLastAnswered] = useState<Person | null>(null);
  const inputRef = useRef<AnswerInputHandle>(null);

  const verb = getVerb(verbInf);
  const effectiveTense = tenses.includes(tense) ? tense : tenses[0];
  const { positions, width, depth } = useMemo(() => layout(persons.length, narrow ? 2 : 3), [persons.length, narrow]);
  const done = persons.every((p) => results[p]);

  const reset = (nextVerb: string, nextTense: Tense) => {
    setVerbInf(nextVerb);
    setTense(nextTense);
    setResults({});
    setShakes({});
    setActive(persons[0]);
    setInput('');
    setLastAnswered(null);
    setRound((r) => r + 1);
    inputRef.current?.focus();
  };

  const submit = () => {
    if (done || results[active] || !input.trim()) return;
    const expected = conjugate(verb, effectiveTense, active);
    const g = gradeAnswer(input, expected);
    record(verb.inf, effectiveTense, active, g);
    const next = { ...results, [active]: { grade: g, given: input } };
    setResults(next);
    setLastAnswered(active);
    if (g === 'wrong') setShakes((s) => ({ ...s, [active]: (s[active] ?? 0) + 1 }));
    setInput('');
    const upcoming = persons.find((p) => !next[p]);
    if (upcoming) setActive(upcoming);
  };

  const score = persons.filter((p) => results[p]?.grade === 'correct').length;
  const accent = TENSE_COLOR[effectiveTense];

  return (
    <ModeLayout title="Conjugation grid" subtitle="Fill in every person for one verb — a warm-up before sentences." stage={
      <CardTable fit={{ width, depth: depth + 0.8 }} label={`Six cards for ${verb.inf} in the ${effectiveTense} tense`}>
        {persons.map((p, i) => {
          const r = results[p];
          return (
            <Card3D
              key={`${round}-${p}`}
              position={positions[i]}
              width={W}
              height={H}
              accent={accent}
              flipped={!!r}
              raised={!done && active === p && !r}
              tint={r ? r.grade : 'none'}
              shake={shakes[p] ?? 0}
              dealFrom={DECK}
              dealDelay={i * 90}
              onClick={(e) => {
                e.stopPropagation();
                if (!r && !done) {
                  setActive(p);
                  inputRef.current?.focus();
                }
              }}
              front={
                <>
                  <CardLabel y={0.55}>{`${verb.inf} · ${TENSE_ES[effectiveTense]}`}</CardLabel>
                  <CardText size={0.38} y={-0.05} maxWidth={W - 0.3}>
                    {PERSON_SHORT[p]}
                  </CardText>
                  <CardText ui size={0.14} y={-0.55} color={INK_SOFT}>
                    {active === p && !done ? 'type it below' : ''}
                  </CardText>
                </>
              }
              back={
                <>
                  <CardLabel y={0.55}>{PERSON_SHORT[p]}</CardLabel>
                  <CardText size={0.42} y={-0.02}>
                    {conjugate(verb, effectiveTense, p)}
                  </CardText>
                  <CardText ui size={0.15} y={-0.52} color={INK_SOFT}>
                    {r && r.grade !== 'correct' ? `you wrote: ${r.given}` : ''}
                  </CardText>
                </>
              }
            />
          );
        })}
      </CardTable>
    }>
      <div className="toolbar">
        <TenseToggle tenses={tenses} value={effectiveTense} onChange={(t) => reset(verbInf, t)} />
        <label className="select">
          <span className="sr-only">Verb</span>
          <select value={verbInf} onChange={(e) => reset(e.target.value, effectiveTense)}>
            {VERBS.map((v) => (
              <option key={v.inf} value={v.inf}>
                {v.inf} — {v.en}
              </option>
            ))}
          </select>
        </label>
        <button className="btn ghost" onClick={() => reset(pickGridVerb(settings, srs, effectiveTense, verbInf).inf, effectiveTense)}>
          🎲 Smart pick
        </button>
      </div>

      {!done ? (
        <>
          <p className="prompt">
            <span className="muted">{verb.inf} ({verb.en}) ·</span> <strong>{PERSON_LABEL[active]}</strong>
          </p>
          <AnswerInput ref={inputRef} value={input} onChange={setInput} onSubmit={submit} label={`${verb.inf}, ${PERSON_LABEL[active]}, ${effectiveTense}`} placeholder={`${PERSON_SHORT[active]} …`} />
        </>
      ) : (
        <div className="round-done">
          <p className="big">
            {score} / {persons.length} correct
          </p>
          <div className="row">
            <button className="btn" onClick={() => reset(verbInf, effectiveTense)}>
              Retry {verb.inf}
            </button>
            <button className="btn primary" autoFocus onClick={() => reset(pickGridVerb(settings, srs, effectiveTense, verbInf).inf, effectiveTense)}>
              Next verb →
            </button>
          </div>
        </div>
      )}

      {lastAnswered && results[lastAnswered] && !done && (
        <LastResult person={lastAnswered} result={results[lastAnswered]} expected={conjugate(verb, effectiveTense, lastAnswered)} />
      )}
    </ModeLayout>
  );
}

function LastResult({ person, result, expected }: { person: Person; result: Result; expected: string }) {
  return (
    <Feedback grade={result.grade}>
      {PERSON_SHORT[person]} →{' '}
      {result.grade === 'correct' ? <b>{expected}</b> : <Diff answer={result.given} expected={expected} />}
    </Feedback>
  );
}
