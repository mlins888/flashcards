import { getVerb } from '../data/verbs';
import type { Sentence } from '../data/sentences';
import { conjugate } from './conjugate';
import { normalize } from './grade';

export interface Chunk {
  text: string;
  optional: boolean;
  isVerb: boolean;
}

export function answerFor(s: Sentence): string {
  return conjugate(getVerb(s.verb), s.tense, s.person);
}

export function parseChunks(pattern: string, verbForm: string): Chunk[] {
  return pattern.split('|').map((raw) => {
    const t = raw.trim();
    const optional = t.startsWith('(') && t.endsWith(')');
    const inner = optional ? t.slice(1, -1).trim() : t;
    const isVerb = inner === '{V}';
    return { text: isVerb ? verbForm : inner, optional, isVerb };
  });
}

export function chunksFor(s: Sentence): Chunk[] {
  return parseChunks(s.es, answerFor(s));
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function toSentence(words: string[]): string {
  return capitalize(words.join(' ')) + '.';
}

/** The full Spanish sentence, including optional subject pronouns. */
export function fullSentence(s: Sentence): string {
  return toSentence(chunksFor(s).map((c) => c.text));
}

/** Every acceptable ordering, each with optional chunks both kept and dropped. */
export function acceptedOrders(s: Sentence): string[] {
  const verb = answerFor(s);
  const out = new Set<string>();
  for (const pattern of [s.es, ...(s.alt ?? [])]) {
    const chunks = parseChunks(pattern, verb);
    const optIdx = chunks.flatMap((c, i) => (c.optional ? [i] : []));
    for (let mask = 0; mask < 1 << optIdx.length; mask++) {
      const drop = new Set(optIdx.filter((_, b) => mask & (1 << b)));
      out.add(normalize(chunks.filter((_, i) => !drop.has(i)).map((c) => c.text).join(' ')));
    }
  }
  return [...out];
}

export function checkAssembly(s: Sentence, words: string[]): boolean {
  return acceptedOrders(s).includes(normalize(words.join(' ')));
}
