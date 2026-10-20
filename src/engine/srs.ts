import type { Grade } from './grade';

export const BOX_COUNT = 5;
const DAY = 24 * 60 * 60 * 1000;
/** Review interval for each Leitner box (index = box - 1). */
export const INTERVALS = [0, 1 * DAY, 3 * DAY, 7 * DAY, 21 * DAY];

export interface SrsEntry {
  box: number; // 1..BOX_COUNT
  due: number; // epoch ms
  seen: number;
  correct: number;
}

export type SrsState = Record<string, SrsEntry>;

export function review(entry: SrsEntry | undefined, result: Grade, now = Date.now()): SrsEntry {
  const prev = entry ?? { box: 1, due: now, seen: 0, correct: 0 };
  let box: number;
  if (result === 'correct') box = Math.min(BOX_COUNT, entry ? prev.box + 1 : 2);
  else if (result === 'almost') box = Math.max(1, prev.box - 1);
  else box = 1;
  return {
    box,
    due: now + INTERVALS[box - 1],
    seen: prev.seen + 1,
    correct: prev.correct + (result === 'correct' ? 1 : 0),
  };
}

/** Relative chance an item is picked: due and weak items first, unseen next, mastered rarely. */
export function weight(entry: SrsEntry | undefined, now = Date.now()): number {
  if (!entry) return 3;
  if (entry.due <= now) return (BOX_COUNT + 1 - entry.box) * 2;
  return 0.4;
}

/** 0 = unseen/weak, 1 = mastered. */
export function mastery(entry: SrsEntry | undefined): number {
  if (!entry) return 0;
  return (entry.box - 1) / (BOX_COUNT - 1);
}

export function weightedPick<T>(items: T[], weightOf: (item: T) => number, rand = Math.random): T {
  const weights = items.map(weightOf);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
