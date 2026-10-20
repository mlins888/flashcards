import type { Person, StemChange, Tense, Verb } from './types';

type Ending = 'ar' | 'er' | 'ir';

const PRESENT: Record<Ending, Record<Person, string>> = {
  ar: { yo: 'o', tu: 'as', el: 'a', nosotros: 'amos', vosotros: 'áis', ellos: 'an' },
  er: { yo: 'o', tu: 'es', el: 'e', nosotros: 'emos', vosotros: 'éis', ellos: 'en' },
  ir: { yo: 'o', tu: 'es', el: 'e', nosotros: 'imos', vosotros: 'ís', ellos: 'en' },
};

const PRETERITE: Record<Ending, Record<Person, string>> = {
  ar: { yo: 'é', tu: 'aste', el: 'ó', nosotros: 'amos', vosotros: 'asteis', ellos: 'aron' },
  er: { yo: 'í', tu: 'iste', el: 'ió', nosotros: 'imos', vosotros: 'isteis', ellos: 'ieron' },
  ir: { yo: 'í', tu: 'iste', el: 'ió', nosotros: 'imos', vosotros: 'isteis', ellos: 'ieron' },
};

/** Endings for strong ("pretérito grave") stems: tuv-e, hic-iste… no written accents. */
const STRONG_PRETERITE: Record<Person, string> = {
  yo: 'e',
  tu: 'iste',
  el: 'o',
  nosotros: 'imos',
  vosotros: 'isteis',
  ellos: 'ieron',
};

const IMPERFECT: Record<Ending, Record<Person, string>> = {
  ar: { yo: 'aba', tu: 'abas', el: 'aba', nosotros: 'ábamos', vosotros: 'abais', ellos: 'aban' },
  er: { yo: 'ía', tu: 'ías', el: 'ía', nosotros: 'íamos', vosotros: 'íais', ellos: 'ían' },
  ir: { yo: 'ía', tu: 'ías', el: 'ía', nosotros: 'íamos', vosotros: 'íais', ellos: 'ían' },
};

const BOOT_PERSONS: ReadonlySet<Person> = new Set(['yo', 'tu', 'el', 'ellos']);

function split(inf: string): [stem: string, ending: Ending] {
  return [inf.slice(0, -2), inf.slice(-2) as Ending];
}

/** Replace the last occurrence of `from` in the stem (the stressed vowel). */
function replaceLast(stem: string, from: string, to: string): string {
  const i = stem.lastIndexOf(from);
  return i === -1 ? stem : stem.slice(0, i) + to + stem.slice(i + from.length);
}

function applyStemChange(stem: string, change: StemChange): string {
  const [from, to] = change.split('>');
  return replaceLast(stem, from, to);
}

function present(verb: Verb, person: Person): string {
  if (person === 'yo' && verb.yo) return verb.yo;
  const [stem, ending] = split(verb.inf);
  const s = verb.stemChange && BOOT_PERSONS.has(person) ? applyStemChange(stem, verb.stemChange) : stem;
  return s + PRESENT[ending][person];
}

function preterite(verb: Verb, person: Person): string {
  const [stem, ending] = split(verb.inf);

  if (verb.preteriteStem) {
    const s = verb.preteriteStem;
    // dij-eron, traj-eron: the i of -ieron is absorbed after j.
    if (person === 'ellos' && s.endsWith('j')) return s + 'eron';
    return s + STRONG_PRETERITE[person];
  }

  if (ending === 'ar') {
    if (person === 'yo') {
      if (stem.endsWith('c')) return stem.slice(0, -1) + 'qué';
      if (stem.endsWith('g')) return stem + 'ué';
      if (stem.endsWith('z')) return stem.slice(0, -1) + 'cé';
    }
    return stem + PRETERITE.ar[person];
  }

  // -er/-ir with a vowel-final stem (leer, creer, caer): i → y in 3rd person, accented í elsewhere.
  if (/[aeo]$/.test(stem)) {
    switch (person) {
      case 'el':
        return stem + 'yó';
      case 'ellos':
        return stem + 'yeron';
      case 'tu':
        return stem + 'íste';
      case 'nosotros':
        return stem + 'ímos';
      case 'vosotros':
        return stem + 'ísteis';
      default:
        return stem + PRETERITE[ending][person];
    }
  }

  // -ir stem-changers shift e→i / o→u in the 3rd person (pidió, durmieron).
  if (ending === 'ir' && verb.stemChange && (person === 'el' || person === 'ellos')) {
    const s = verb.stemChange.startsWith('o') ? replaceLast(stem, 'o', 'u') : replaceLast(stem, 'e', 'i');
    return s + PRETERITE.ir[person];
  }

  return stem + PRETERITE[ending][person];
}

function imperfect(verb: Verb, person: Person): string {
  const [stem, ending] = split(verb.inf);
  return stem + IMPERFECT[ending][person];
}

export function conjugate(verb: Verb, tense: Tense, person: Person): string {
  const override = verb[tense]?.[person];
  if (override) return override;
  switch (tense) {
    case 'present':
      return present(verb, person);
    case 'preterite':
      return preterite(verb, person);
    case 'imperfect':
      return imperfect(verb, person);
  }
}
