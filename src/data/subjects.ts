import type { Person } from '../engine/types';

export interface Subject {
  es: string;
  en: string;
  person: Person;
}

/** Default pronoun used when a sentence leaves the subject implicit. */
export const PRONOUN: Record<Person, string> = {
  yo: 'yo',
  tu: 'tú',
  el: 'él',
  nosotros: 'nosotros',
  vosotros: 'vosotros',
  ellos: 'ellos',
};

export const SUBJECTS: Subject[] = [
  { es: 'yo', en: 'I', person: 'yo' },
  { es: 'tú', en: 'you', person: 'tu' },
  { es: 'él', en: 'he', person: 'el' },
  { es: 'ella', en: 'she', person: 'el' },
  { es: 'usted', en: 'you (formal)', person: 'el' },
  { es: 'mi hermana', en: 'my sister', person: 'el' },
  { es: 'el perro', en: 'the dog', person: 'el' },
  { es: 'nosotros', en: 'we', person: 'nosotros' },
  { es: 'mi amigo y yo', en: 'my friend and I', person: 'nosotros' },
  { es: 'vosotros', en: 'you all (Spain)', person: 'vosotros' },
  { es: 'ellos', en: 'they', person: 'ellos' },
  { es: 'ellas', en: 'they (fem.)', person: 'ellos' },
  { es: 'ustedes', en: 'you all', person: 'ellos' },
  { es: 'mis padres', en: 'my parents', person: 'ellos' },
  { es: 'los niños', en: 'the kids', person: 'ellos' },
];
