import type { ReactNode } from 'react';
import type { Grade } from '../engine/grade';

const TITLE: Record<Grade, string> = {
  correct: '¡Correcto!',
  almost: 'Casi — check the accent',
  wrong: 'Not quite',
};

export function Feedback({ grade, children }: { grade: Grade; children?: ReactNode }) {
  return (
    <div className={`feedback ${grade}`} role="status" aria-live="polite">
      <strong>{TITLE[grade]}</strong>
      {children && <div className="feedback-body">{children}</div>}
    </div>
  );
}

/** Highlights where the answer and the expected form differ (accent marks especially). */
export function Diff({ answer, expected }: { answer: string; expected: string }) {
  const a = answer.trim().toLowerCase();
  return (
    <span className="diff">
      {[...expected].map((ch, i) => (
        <span key={i} className={a[i] === ch ? '' : 'diff-miss'}>
          {ch}
        </span>
      ))}
    </span>
  );
}
