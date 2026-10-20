import { useRef, useState } from 'react';
import { getVerb } from '../data/verbs';
import { hintFor } from '../data/sentences';
import { grade as gradeAnswer, type Grade } from '../engine/grade';
import { pickSentence } from '../engine/generators';
import { answerFor, chunksFor, toSentence } from '../engine/sentence';
import { TENSE_ES, type Tense } from '../engine/types';
import { useApp } from '../state/store';
import { Card3D, CardLabel, CardText, type Vec3 } from '../three/Card3D';
import { CardTable } from '../three/CardTable';
import { INK, INK_SOFT, NEUTRAL_RIM, TENSE_COLOR } from '../three/theme';
import { AnswerInput, type AnswerInputHandle } from '../ui/AnswerInput';
import { Diff, Feedback } from '../ui/Feedback';
import { ModeLayout } from '../ui/ModeLayout';
import { TenseChip } from '../ui/TenseToggle';
import { useNarrow } from '../ui/useNarrow';

const DECK: Vec3 = [8, 0, 3];
const BLANK = '_____';
const BLANK_COLOR = '#c9862f';

/** Text plus a colorRanges map that paints `[start, end)` in `color`. */
function highlight(words: string[], index: number, color: string) {
  const text = toSentence(words);
  const start = words.slice(0, index).reduce((n, w) => n + w.length + 1, 0);
  const end = start + words[index].length;
  return { text, colorRanges: { 0: INK, [start]: color, [end]: INK } };
}

export function ContextConjugate() {
  const settings = useApp((s) => s.settings);
  const srs = useApp((s) => s.srs);
  const record = useApp((s) => s.record);
  const narrow = useNarrow();

  const [sentence, setSentence] = useState(() => pickSentence(settings, srs));
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ grade: Grade; given: string } | null>(null);
  const [shake, setShake] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [round, setRound] = useState(0);
  const inputRef = useRef<AnswerInputHandle>(null);

  const verb = getVerb(sentence.verb);
  const answer = answerFor(sentence);
  const chunks = chunksFor(sentence);
  const words = chunks.map((c) => c.text);
  const verbIndex = chunks.findIndex((c) => c.isVerb);
  const tenseColor = TENSE_COLOR[sentence.tense as Tense];

  const front = highlight(words.map((w, i) => (i === verbIndex ? BLANK : w)), verbIndex, BLANK_COLOR);
  const back = highlight(words, verbIndex, tenseColor);

  const W = narrow ? 4.4 : 6;
  const H = narrow ? 3.6 : 3.4;

  const submit = () => {
    if (result) return next();
    if (!input.trim()) return;
    const g = gradeAnswer(input, answer);
    record(sentence.verb, sentence.tense, sentence.person, g);
    setResult({ grade: g, given: input });
    if (g === 'wrong') setShake((s) => s + 1);
  };

  const next = () => {
    setSentence(pickSentence(settings, useApp.getState().srs, sentence.id));
    setInput('');
    setResult(null);
    setShowEnglish(false);
    setRound((r) => r + 1);
    inputRef.current?.focus();
  };

  return (
    <ModeLayout
      title="Conjugate in context"
      subtitle="Use the time clue to choose the tense, and the subject to choose the person."
      stage={
        <CardTable fit={{ width: W + 0.6, depth: H + 0.8 }} label={`Sentence card: ${front.text}`}>
          <Card3D
            key={round}
            position={[0, 0, 0]}
            width={W}
            height={H}
            accent={result ? tenseColor : NEUTRAL_RIM}
            flipped={!!result}
            tint={result?.grade ?? 'none'}
            shake={shake}
            dealFrom={DECK}
            hoverable={false}
            front={
              <>
                <CardLabel y={H / 2 - 0.4} maxWidth={W - 0.7}>
                  complete the sentence
                </CardLabel>
                <CardText size={narrow ? 0.34 : 0.4} y={0.15} maxWidth={W - 0.7} colorRanges={front.colorRanges}>
                  {front.text}
                </CardText>
                <CardText ui size={0.22} y={-H / 2 + 0.55} color={INK_SOFT} maxWidth={W - 0.7}>
                  {`(${verb.inf} — ${verb.en})`}
                </CardText>
              </>
            }
            back={
              <>
                <CardLabel y={H / 2 - 0.4} color={tenseColor} maxWidth={W - 0.7}>{`${TENSE_ES[sentence.tense]} · ${answer}`}</CardLabel>
                <CardText size={narrow ? 0.34 : 0.4} y={0.25} maxWidth={W - 0.7} colorRanges={back.colorRanges}>
                  {back.text}
                </CardText>
                <CardText ui size={0.2} y={-H / 2 + 0.6} color={INK_SOFT} maxWidth={W - 0.7}>
                  {sentence.en}
                </CardText>
              </>
            }
          />
        </CardTable>
      }
    >
      <div className="row">
        <button className="btn ghost small" onClick={() => setShowEnglish((s) => !s)} aria-pressed={showEnglish}>
          {showEnglish ? 'Hide English' : 'Show English'}
        </button>
        {showEnglish && <span className="muted">{sentence.en}</span>}
      </div>

      <AnswerInput
        ref={inputRef}
        value={input}
        onChange={setInput}
        onSubmit={submit}
        label={`Conjugate ${verb.inf} for this sentence`}
        placeholder={`${verb.inf} → …`}
        disabled={!!result}
      />

      {result && (
        <Feedback grade={result.grade}>
          <p style={{ margin: 0 }}>
            {result.grade === 'correct' ? <b>{answer}</b> : <Diff answer={result.given} expected={answer} />} <TenseChip tense={sentence.tense} />
          </p>
          <p className="hint">{hintFor(sentence) ?? `This sentence uses the ${sentence.tense}.`}</p>
          <p className="hint">{sentence.en}</p>
        </Feedback>
      )}

      {result && (
        <div>
          <button className="btn primary" autoFocus onClick={next}>
            Next sentence →
          </button>
        </div>
      )}
    </ModeLayout>
  );
}
