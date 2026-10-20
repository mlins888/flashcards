export const PERSONS = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'] as const;
export type Person = (typeof PERSONS)[number];

export const TENSES = ['present', 'preterite', 'imperfect'] as const;
export type Tense = (typeof TENSES)[number];

export const PERSON_LABEL: Record<Person, string> = {
  yo: 'yo',
  tu: 'tú',
  el: 'él / ella / usted',
  nosotros: 'nosotros',
  vosotros: 'vosotros',
  ellos: 'ellos / ellas / ustedes',
};

/** Short label that fits on a card. */
export const PERSON_SHORT: Record<Person, string> = {
  yo: 'yo',
  tu: 'tú',
  el: 'él / ella',
  nosotros: 'nosotros',
  vosotros: 'vosotros',
  ellos: 'ellos / ellas',
};

export const TENSE_LABEL: Record<Tense, string> = {
  present: 'Present',
  preterite: 'Preterite',
  imperfect: 'Imperfect',
};

export const TENSE_ES: Record<Tense, string> = {
  present: 'presente',
  preterite: 'pretérito',
  imperfect: 'imperfecto',
};

export type StemChange = 'e>ie' | 'o>ue' | 'e>i' | 'u>ue';

export type Forms = Partial<Record<Person, string>>;

export interface Verb {
  inf: string;
  en: string;
  stemChange?: StemChange;
  /** Irregular present-tense yo form (tengo, hago, conozco…). */
  yo?: string;
  /** Strong preterite stem (tuv-, hic-, dij-…) taking -e, -iste, -o, -imos, -isteis, -ieron. */
  preteriteStem?: string;
  present?: Forms;
  preterite?: Forms;
  imperfect?: Forms;
}

export type ItemKey = `${string}|${Tense}|${Person}`;

export const itemKey = (verb: string, tense: Tense, person: Person): ItemKey =>
  `${verb}|${tense}|${person}`;
