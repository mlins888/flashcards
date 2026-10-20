import { useEffect, useRef, useState } from 'react';
import { VERBS, VERB_BY_INF } from '../data/verbs';
import { SUBJECTS } from '../data/subjects';
import { grade as gradeAnswer, normalize, stripAccents, type Grade } from '../engine/grade';
import { activeTenses, exampleFor, pickSlots, type SlotSpin } from '../engine/generators';
import { fullSentence } from '../engine/sentence';
import { TENSES, TENSE_ES, TENSE_LABEL, type Tense } from '../engine/types';
import { useApp } from '../state/store';
import { CardLabel, CardText } from '../three/Card3D';
import { CardTable } from '../three/CardTable';
import { SlotReel } from '../three/SlotReel';
import { INK_SOFT, NEUTRAL_RIM, TENSE_COLOR } from '../three/theme';
import { AnswerInput, type AnswerInputHandle } from '../ui/AnswerInput';
import { Diff, Feedback } from '../ui/Feedback';
import { ModeLayout } from '../ui/ModeLayout';
import { TenseChip } from '../ui/TenseToggle';
import { useNarrow } from '../ui/useNarrow';

type Phase = 'idle' | 'spinning' | 'landing' | 'ready';

const SPIN_MS = 900;
const STAGGER_MS = 350;

const SUBJECT_POOL = SUBJECTS.map((s) => s.es);
const VERB_POOL = VERBS.map((v) => v.inf);
const TENSE_POOL = TENSES.map((t) => TENSE_ES[t]);
const TENSE_BY_ES = Object.fromEntries(TENSES.map((t) => [TENSE_ES[t], t])) as Record<string, Tense>;

export function SentenceSlots() {
  const settings = useApp((s) => s.settings);
  const record = useApp((s) => s.record);
  const narrow = useNarrow();

  const [phase, setPhase] = useState<Phase>('idle');
  const [spin, setSpin] = useState<SlotSpin | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ grade: Grade; given: string } | null>(null);
  const [sentenceInput, setSentenceInput] = useState('');
  const [sentenceChecked, setSentenceChecked] = useState(false);
  const inputRef = useRef<AnswerInputHandle>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const doSpin = () => {
    timers.current.forEach(clearTimeout);
    setSpin(pickSlots(settings, useApp.getState().srs));
    setPhase('spinning');
    setInput('');
    setResult(null);
    setSentenceInput('');
    setSentenceChecked(false);
    timers.current = [
      window.setTimeout(() => setPhase('landing'), SPIN_MS),
      window.setTimeout(() => {
        setPhase('ready');
        inputRef.current?.focus();
      }, SPIN_MS + STAGGER_MS * 2 + 500),
    ];
  };

  const submit = () => {
    if (!spin || result || !input.trim()) return;
    const g = gradeAnswer(input, spin.answer);
    record(spin.verb.inf, spin.tense, spin.subject.person, g);
    setResult({ grade: g, given: input });
  };

  const W = narrow ? 1.9 : 2.5;
  const H = narrow ? 2.7 : 3.3;
  const GAP = narrow ? 0.25 : 0.5;
  const xs = [-(W + GAP), 0, W + GAP];
  const spinning = phase === 'spinning';
  const ready = phase === 'ready';
  const tenseAccent = spin && ready ? TENSE_COLOR[spin.tense] : NEUTRAL_RIM;
  const textW = W - 0.35;

  const usedForm =
    sentenceChecked && spin && normalize(sentenceInput).split(' ').some((w) => stripAccents(w) === stripAccents(spin.answer));
  const example = spin && exampleFor(spin.verb.inf, spin.tense);

  return (
    <ModeLayout
      title="Sentence slots"
      subtitle="Spin a subject, a verb and a tense. Conjugate it, then make it a real sentence."
      stage={
        <CardTable fit={{ width: 3 * W + 2 * GAP + 0.4, depth: H + 1.2 }} label={spin ? `${spin.subject.es}, ${spin.verb.inf}, ${spin.tense}` : 'Three slot cards'}>
          <SlotReel
            position={[xs[0], 0, 0]}
            width={W}
            height={H}
            spinning={spinning}
            stopDelay={0}
            pool={SUBJECT_POOL}
            final={spin?.subject.es ?? '?'}
            accent={NEUTRAL_RIM}
            render={(text) => (
              <>
                <CardLabel y={H / 2 - 0.35}>sujeto</CardLabel>
                <CardText size={narrow ? 0.34 : 0.42} maxWidth={textW}>
                  {text}
                </CardText>
                <CardText ui size={0.16} y={-H / 2 + 0.45} color={INK_SOFT} maxWidth={textW}>
                  {SUBJECTS.find((s) => s.es === text)?.en ?? 'subject'}
                </CardText>
              </>
            )}
          />
          <SlotReel
            position={[xs[1], 0, 0]}
            width={W}
            height={H}
            spinning={spinning}
            stopDelay={STAGGER_MS}
            pool={VERB_POOL}
            final={spin?.verb.inf ?? '?'}
            accent={NEUTRAL_RIM}
            render={(text) => (
              <>
                <CardLabel y={H / 2 - 0.35}>verbo</CardLabel>
                <CardText size={narrow ? 0.34 : 0.42} maxWidth={textW}>
                  {text}
                </CardText>
                <CardText ui size={0.16} y={-H / 2 + 0.45} color={INK_SOFT} maxWidth={textW}>
                  {VERB_BY_INF[text]?.en ?? 'verb'}
                </CardText>
              </>
            )}
          />
          <SlotReel
            position={[xs[2], 0, 0]}
            width={W}
            height={H}
            spinning={spinning}
            stopDelay={STAGGER_MS * 2}
            pool={TENSE_POOL.filter((t) => activeTenses(settings).includes(TENSE_BY_ES[t]))}
            final={spin ? TENSE_ES[spin.tense] : '?'}
            accent={tenseAccent}
            render={(text) => (
              <>
                <CardLabel y={H / 2 - 0.35}>tiempo</CardLabel>
                <CardText size={narrow ? 0.3 : 0.4} maxWidth={textW} color={TENSE_BY_ES[text] && ready ? TENSE_COLOR[TENSE_BY_ES[text]] : undefined}>
                  {text}
                </CardText>
                <CardText ui size={0.16} y={-H / 2 + 0.45} color={INK_SOFT} maxWidth={textW}>
                  {TENSE_BY_ES[text] ? TENSE_LABEL[TENSE_BY_ES[text]].toLowerCase() : 'tense'}
                </CardText>
              </>
            )}
          />
        </CardTable>
      }
    >
      {!spin || !ready ? (
        <div className="row">
          <button className="btn primary" onClick={doSpin} disabled={phase === 'spinning' || phase === 'landing'}>
            {phase === 'idle' ? '🎰 Spin' : 'Spinning…'}
          </button>
          {phase === 'idle' && <span className="muted">Every spin is weighted toward the forms you miss most.</span>}
        </div>
      ) : (
        <>
          <p className="slot-summary">
            <b>{spin.subject.es}</b> + <b>{spin.verb.inf}</b> <span className="muted">({spin.verb.en})</span> + <TenseChip tense={spin.tense} />
          </p>
          <AnswerInput
            ref={inputRef}
            value={input}
            onChange={setInput}
            onSubmit={submit}
            disabled={!!result}
            label={`Conjugate ${spin.verb.inf} for ${spin.subject.es} in the ${spin.tense}`}
            placeholder={`${spin.subject.es} …`}
          />

          {result && (
            <Feedback grade={result.grade}>
              {spin.subject.es} → {result.grade === 'correct' ? <b>{spin.answer}</b> : <Diff answer={result.given} expected={spin.answer} />}
            </Feedback>
          )}

          {result && (
            <div className="round-done">
              <p className="muted" style={{ margin: 0 }}>
                Now use it in a sentence of your own (optional — not graded):
              </p>
              {!sentenceChecked ? (
                <AnswerInput
                  value={sentenceInput}
                  onChange={setSentenceInput}
                  onSubmit={() => sentenceInput.trim() && setSentenceChecked(true)}
                  label="Your sentence"
                  placeholder={`${spin.subject.es} ${spin.answer} …`}
                  submitLabel="Done"
                  multiline
                />
              ) : (
                <div className="feedback almost" style={{ borderStyle: 'dashed' }}>
                  <p className="example" style={{ margin: 0 }}>
                    {sentenceInput}
                  </p>
                  <p className="hint">{usedForm ? `Nice — you used ${spin.answer}.` : `Tip: try to include the form ${spin.answer}.`}</p>
                </div>
              )}
              {example && (
                <p className="hint">
                  Example with {spin.verb.inf} in the {TENSE_LABEL[spin.tense].toLowerCase()}: <span className="example">{fullSentence(example)}</span>{' '}
                  <span className="muted">— {example.en}</span>
                </p>
              )}
              <div>
                <button className="btn primary" onClick={doSpin}>
                  🎰 Spin again
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </ModeLayout>
  );
}
