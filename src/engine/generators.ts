import { VERBS } from '../data/verbs';
import { SENTENCES, type Sentence } from '../data/sentences';
import { SUBJECTS, type Subject } from '../data/subjects';
import { conjugate } from './conjugate';
import { weight, weightedPick, type SrsState } from './srs';
import { PERSONS, TENSES, itemKey, type Person, type Tense, type Verb } from './types';

export interface PracticeSettings {
  tenses: Tense[];
  vosotros: boolean;
}

export function activePersons(settings: PracticeSettings): Person[] {
  return settings.vosotros ? [...PERSONS] : PERSONS.filter((p) => p !== 'vosotros');
}

export function activeTenses(settings: PracticeSettings): Tense[] {
  return settings.tenses.length ? settings.tenses : [...TENSES];
}

export function shuffle<T>(arr: T[], rand = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickSentence(settings: PracticeSettings, srs: SrsState, excludeId?: string): Sentence {
  const tenses = activeTenses(settings);
  const persons = activePersons(settings);
  let pool = SENTENCES.filter((s) => tenses.includes(s.tense) && persons.includes(s.person));
  if (pool.length > 1 && excludeId) pool = pool.filter((s) => s.id !== excludeId);
  if (!pool.length) pool = SENTENCES;
  return weightedPick(pool, (s) => weight(srs[itemKey(s.verb, s.tense, s.person)]));
}

/** Pick the verb whose row in this tense needs the most work. */
export function pickGridVerb(settings: PracticeSettings, srs: SrsState, tense: Tense, exclude?: string): Verb {
  const persons = activePersons(settings);
  const pool = VERBS.filter((v) => v.inf !== exclude);
  return weightedPick(pool, (v) => persons.reduce((sum, p) => sum + weight(srs[itemKey(v.inf, tense, p)]), 0));
}

/** Wrong-but-plausible forms: same verb, other persons or other tenses. */
export function verbDecoys(verb: Verb, tense: Tense, person: Person, settings: PracticeSettings, n = 3): string[] {
  const answer = conjugate(verb, tense, person);
  const persons = activePersons(settings);
  const sameTense = persons.filter((p) => p !== person).map((p) => conjugate(verb, tense, p));
  const otherTense = TENSES.filter((t) => t !== tense).map((t) => conjugate(verb, t, person));
  const unique = (xs: string[]) => [...new Set(xs)].filter((x) => x !== answer);
  // Prefer one or two wrong-tense decoys so the tense contrast is always on the table.
  const tenseDecoys = shuffle(unique(otherTense)).slice(0, 2);
  const personDecoys = shuffle(unique(sameTense).filter((x) => !tenseDecoys.includes(x)));
  return [...tenseDecoys, ...personDecoys].slice(0, n);
}

export interface SlotSpin {
  subject: Subject;
  verb: Verb;
  tense: Tense;
  answer: string;
}

export function pickSlots(settings: PracticeSettings, srs: SrsState): SlotSpin {
  const persons = activePersons(settings);
  const tenses = activeTenses(settings);
  const items = VERBS.flatMap((v) => tenses.flatMap((t) => persons.map((p) => ({ v, t, p }))));
  const { v, t, p } = weightedPick(items, (i) => weight(srs[itemKey(i.v.inf, i.t, i.p)]));
  const subjects = SUBJECTS.filter((s) => s.person === p);
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  return { subject, verb: v, tense: t, answer: conjugate(v, t, p) };
}

export function exampleFor(verb: string, tense: Tense): Sentence | undefined {
  return SENTENCES.find((s) => s.verb === verb && s.tense === tense);
}
