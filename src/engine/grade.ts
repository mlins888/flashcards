export type Grade = 'correct' | 'almost' | 'wrong';

export function normalize(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[.,!?¡¿;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC');
}

/** Correct if exact, "almost" if only accents/tildes differ. */
export function grade(answer: string, expected: string): Grade {
  const a = normalize(answer);
  const e = normalize(expected);
  if (a === e) return 'correct';
  if (a && stripAccents(a) === stripAccents(e)) return 'almost';
  return 'wrong';
}

/** Best grade against any of several acceptable answers. */
export function gradeAny(answer: string, accepted: string[]): Grade {
  let best: Grade = 'wrong';
  for (const e of accepted) {
    const g = grade(answer, e);
    if (g === 'correct') return g;
    if (g === 'almost') best = g;
  }
  return best;
}
