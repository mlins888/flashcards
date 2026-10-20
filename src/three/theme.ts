import type { Tense } from '../engine/types';

export const TENSE_COLOR: Record<Tense, string> = {
  present: '#2bb3a3',
  preterite: '#f2735a',
  imperfect: '#9a7bf2',
};

export const INK = '#2a2438';
export const INK_SOFT = '#6d6580';
export const PAPER = '#fbf6ec';
export const NEUTRAL_RIM = '#d9c9a8';

export const TINT = {
  none: PAPER,
  correct: '#cdeed6',
  almost: '#fbe8b4',
  wrong: '#f8cdc5',
  active: '#fffaf0',
} as const;
export type Tint = keyof typeof TINT;

const base = import.meta.env.BASE_URL;
export const FONT_DISPLAY = `${base}fonts/Fraunces-600.woff`;
export const FONT_UI = `${base}fonts/Inter-500.woff`;
