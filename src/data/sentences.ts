import type { Person, Tense } from '../engine/types';

/**
 * `es` is a pipe-separated list of word chunks (each chunk becomes one card).
 * `{V}` is replaced by the engine's conjugation, so the bank can't drift from the rules.
 * A chunk in parentheses is optional — usually the subject pronoun, since Spanish drops it.
 * `alt` lists other accepted word orders in the same format.
 */
export interface Sentence {
  id: string;
  en: string;
  es: string;
  alt?: string[];
  verb: string;
  person: Person;
  tense: Tense;
  /** The word(s) that signal the tense. */
  cue?: string;
  hint?: string;
}

export const SENTENCES: Sentence[] = [
  // ── Preterite: finished, one-time actions ─────────────────────────────
  { id: 'pret-comer', en: 'We ate tacos yesterday.', es: 'ayer | (nosotros) | {V} | tacos', alt: ['(nosotros) | {V} | tacos | ayer'], verb: 'comer', person: 'nosotros', tense: 'preterite', cue: 'ayer' },
  { id: 'pret-hablar', en: 'I talked with my mom last night.', es: 'anoche | (yo) | {V} | con mi mamá', alt: ['(yo) | {V} | con mi mamá | anoche'], verb: 'hablar', person: 'yo', tense: 'preterite', cue: 'anoche' },
  { id: 'pret-escribir', en: 'Yesterday she wrote a letter.', es: 'ayer | (ella) | {V} | una carta', alt: ['(ella) | {V} | una carta | ayer'], verb: 'escribir', person: 'el', tense: 'preterite', cue: 'ayer' },
  { id: 'pret-ir', en: 'Last summer they went to the beach.', es: 'el verano pasado | (ellos) | {V} | a la playa', alt: ['(ellos) | {V} | a la playa | el verano pasado'], verb: 'ir', person: 'ellos', tense: 'preterite', cue: 'el verano pasado' },
  { id: 'pret-tener', en: 'Yesterday I had a problem.', es: 'ayer | (yo) | {V} | un problema', alt: ['(yo) | {V} | un problema | ayer'], verb: 'tener', person: 'yo', tense: 'preterite', cue: 'ayer' },
  { id: 'pret-hacer', en: 'Last night you did the homework.', es: 'anoche | (tú) | {V} | la tarea', alt: ['(tú) | {V} | la tarea | anoche'], verb: 'hacer', person: 'tu', tense: 'preterite', cue: 'anoche' },
  { id: 'pret-buscar', en: 'This morning I looked for my keys.', es: 'esta mañana | (yo) | {V} | mis llaves', alt: ['(yo) | {V} | mis llaves | esta mañana'], verb: 'buscar', person: 'yo', tense: 'preterite', cue: 'esta mañana', hint: '“Esta mañana” is a finished time frame here — the search is over → preterite. Note the spelling: c → qu before é.' },
  { id: 'pret-llegar', en: 'I arrived late yesterday.', es: 'ayer | (yo) | {V} | tarde', alt: ['(yo) | {V} | tarde | ayer'], verb: 'llegar', person: 'yo', tense: 'preterite', cue: 'ayer', hint: '“Ayer” marks a completed action → preterite. Spelling: g → gu before é.' },
  { id: 'pret-empezar', en: 'Last week I started a new book.', es: 'la semana pasada | (yo) | {V} | un libro nuevo', alt: ['(yo) | {V} | un libro nuevo | la semana pasada'], verb: 'empezar', person: 'yo', tense: 'preterite', cue: 'la semana pasada', hint: '“La semana pasada” → completed action → preterite. Spelling: z → c before é.' },
  { id: 'pret-pedir', en: 'An hour ago he ordered a coffee.', es: 'hace una hora | (él) | {V} | un café', alt: ['(él) | {V} | un café | hace una hora'], verb: 'pedir', person: 'el', tense: 'preterite', cue: 'hace una hora', hint: '“Hace una hora” (an hour ago) pins a finished moment → preterite. -ir stem change e → i in the 3rd person.' },
  { id: 'pret-dormir', en: 'Last night the kids slept ten hours.', es: 'anoche | los niños | {V} | diez horas', alt: ['los niños | {V} | diez horas | anoche'], verb: 'dormir', person: 'ellos', tense: 'preterite', cue: 'anoche', hint: '“Anoche” + a bounded duration (diez horas) → preterite. -ir stem change o → u in the 3rd person.' },
  { id: 'pret-leer', en: 'Last month my friends read the whole book.', es: 'el mes pasado | mis amigos | {V} | todo el libro', alt: ['mis amigos | {V} | todo el libro | el mes pasado'], verb: 'leer', person: 'ellos', tense: 'preterite', cue: 'el mes pasado', hint: '“El mes pasado” → completed → preterite. Leer turns i → y: leyeron.' },
  { id: 'pret-decir', en: 'Yesterday my grandma told me the truth.', es: 'ayer | mi abuela | me | {V} | la verdad', alt: ['mi abuela | me | {V} | la verdad | ayer'], verb: 'decir', person: 'el', tense: 'preterite', cue: 'ayer' },
  { id: 'pret-jugar', en: 'On Saturday you all played soccer.', es: 'el sábado | (vosotros) | {V} | al fútbol', alt: ['(vosotros) | {V} | al fútbol | el sábado'], verb: 'jugar', person: 'vosotros', tense: 'preterite', cue: 'el sábado', hint: '“El sábado” (that one Saturday) → single event → preterite.' },
  { id: 'pret-ver', en: 'Suddenly I saw a dog.', es: 'de repente | (yo) | {V} | un perro', verb: 'ver', person: 'yo', tense: 'preterite', cue: 'de repente', hint: '“De repente” (suddenly) interrupts — a sudden event → preterite.' },
  { id: 'pret-vivir', en: 'Last year I lived in Mexico.', es: 'el año pasado | (yo) | {V} | en México', alt: ['(yo) | {V} | en México | el año pasado'], verb: 'vivir', person: 'yo', tense: 'preterite', cue: 'el año pasado', hint: '“El año pasado” frames a closed period → preterite.' },
  { id: 'pret-venir', en: 'Last night they came to the party.', es: 'anoche | (ellos) | {V} | a la fiesta', alt: ['(ellos) | {V} | a la fiesta | anoche'], verb: 'venir', person: 'ellos', tense: 'preterite', cue: 'anoche' },
  { id: 'pret-traer', en: 'Last night you brought the wine.', es: 'anoche | (tú) | {V} | el vino', alt: ['(tú) | {V} | el vino | anoche'], verb: 'traer', person: 'tu', tense: 'preterite', cue: 'anoche' },
  { id: 'pret-poder', en: "Yesterday I couldn't sleep.", es: 'ayer | (yo) | no | {V} | dormir', alt: ['(yo) | no | {V} | dormir | ayer'], verb: 'poder', person: 'yo', tense: 'preterite', cue: 'ayer' },
  { id: 'pret-comprar', en: 'On Monday she bought a car.', es: 'el lunes | (ella) | {V} | un coche', alt: ['(ella) | {V} | un coche | el lunes'], verb: 'comprar', person: 'el', tense: 'preterite', cue: 'el lunes' },
  { id: 'pret-estar', en: 'Last week we were in Madrid for three days.', es: 'la semana pasada | (nosotros) | {V} | en Madrid | tres días', alt: ['(nosotros) | {V} | en Madrid | tres días | la semana pasada'], verb: 'estar', person: 'nosotros', tense: 'preterite', cue: 'tres días', hint: 'A stay with a clear start and end (tres días) → preterite, even with estar.' },
  { id: 'pret-ser', en: 'The party was a success.', es: 'la fiesta | {V} | un éxito', verb: 'ser', person: 'el', tense: 'preterite', hint: 'A judgment about a finished event as a whole → preterite.' },
  { id: 'pret-abrir', en: 'This morning you all opened the store.', es: 'esta mañana | (vosotros) | {V} | la tienda', alt: ['(vosotros) | {V} | la tienda | esta mañana'], verb: 'abrir', person: 'vosotros', tense: 'preterite', cue: 'esta mañana' },

  // ── Imperfect: habits, background, ongoing past ───────────────────────
  { id: 'imp-jugar', en: 'As a kid, I played soccer every day.', es: 'de niño | (yo) | {V} | al fútbol | todos los días', alt: ['(yo) | {V} | al fútbol | todos los días | de niño'], verb: 'jugar', person: 'yo', tense: 'imperfect', cue: 'de niño', hint: '“De niño” + “todos los días” → a repeated childhood habit → imperfect.' },
  { id: 'imp-comer', en: "We always used to eat at grandma's house.", es: '(nosotros) | siempre | {V} | en casa de la abuela', alt: ['siempre | (nosotros) | {V} | en casa de la abuela'], verb: 'comer', person: 'nosotros', tense: 'imperfect', cue: 'siempre' },
  { id: 'imp-decir', en: 'My grandpa always told the truth.', es: 'mi abuelo | siempre | {V} | la verdad', verb: 'decir', person: 'el', tense: 'imperfect', cue: 'siempre' },
  { id: 'imp-ir', en: 'Every summer they used to go to the beach.', es: 'cada verano | (ellos) | {V} | a la playa', alt: ['(ellos) | {V} | a la playa | cada verano'], verb: 'ir', person: 'ellos', tense: 'imperfect', cue: 'cada verano' },
  { id: 'imp-ser', en: 'When I was young, I was very shy.', es: 'de joven | (yo) | {V} | muy tímido', alt: ['(yo) | {V} | muy tímido | de joven'], verb: 'ser', person: 'yo', tense: 'imperfect', cue: 'de joven', hint: 'Describing what someone was like back then → imperfect.' },
  { id: 'imp-leer', en: 'I was reading while my brother slept.', es: '(yo) | {V} | mientras | mi hermano dormía', alt: ['mientras | mi hermano dormía | (yo) | {V}'], verb: 'leer', person: 'yo', tense: 'imperfect', cue: 'mientras', hint: '“Mientras” (while) sets up two ongoing actions → imperfect.' },
  { id: 'imp-vivir', en: 'You used to live in Madrid.', es: 'antes | (tú) | {V} | en Madrid', alt: ['(tú) | antes | {V} | en Madrid', '(tú) | {V} | en Madrid | antes'], verb: 'vivir', person: 'tu', tense: 'imperfect', cue: 'antes', hint: '“Antes” (before / used to) → a past state with no set end → imperfect.' },
  { id: 'imp-tener', en: 'When we were little, we had a cat.', es: 'de pequeños | (nosotros) | {V} | un gato', alt: ['(nosotros) | {V} | un gato | de pequeños'], verb: 'tener', person: 'nosotros', tense: 'imperfect', cue: 'de pequeños' },
  { id: 'imp-querer', en: 'My sister always wanted to dance.', es: 'mi hermana | siempre | {V} | bailar', verb: 'querer', person: 'el', tense: 'imperfect', cue: 'siempre', hint: 'Ongoing desire in the past → imperfect.' },
  { id: 'imp-hablar', en: 'Before, you all used to speak Spanish at home.', es: 'antes | (vosotros) | {V} | español | en casa', alt: ['(vosotros) | {V} | español | en casa | antes'], verb: 'hablar', person: 'vosotros', tense: 'imperfect', cue: 'antes' },
  { id: 'imp-ver', en: 'The kids used to watch TV every afternoon.', es: 'los niños | {V} | la tele | todas las tardes', alt: ['todas las tardes | los niños | {V} | la tele'], verb: 'ver', person: 'ellos', tense: 'imperfect', cue: 'todas las tardes' },
  { id: 'imp-escribir', en: 'I used to write poems every night.', es: '(yo) | {V} | poemas | todas las noches', alt: ['todas las noches | (yo) | {V} | poemas'], verb: 'escribir', person: 'yo', tense: 'imperfect', cue: 'todas las noches' },
  { id: 'imp-trabajar', en: 'Back then my parents worked a lot.', es: 'en esa época | mis padres | {V} | mucho', alt: ['mis padres | {V} | mucho | en esa época'], verb: 'trabajar', person: 'ellos', tense: 'imperfect', cue: 'en esa época', hint: '“En esa época” (back then) → background description → imperfect.' },
  { id: 'imp-estar', en: 'You were always very happy.', es: '(tú) | siempre | {V} | muy feliz', verb: 'estar', person: 'tu', tense: 'imperfect', cue: 'siempre' },
  { id: 'imp-ir2', en: 'On Sundays we used to go to the park.', es: 'los domingos | (nosotros) | {V} | al parque', alt: ['(nosotros) | {V} | al parque | los domingos'], verb: 'ir', person: 'nosotros', tense: 'imperfect', cue: 'los domingos', hint: '“Los domingos” (on Sundays, plural) → a repeated habit → imperfect.' },
  { id: 'imp-beber', en: 'As a kid, I drank milk every day.', es: 'de niño | (yo) | {V} | leche | todos los días', alt: ['(yo) | {V} | leche | todos los días | de niño'], verb: 'beber', person: 'yo', tense: 'imperfect', cue: 'de niño' },
  { id: 'imp-dar', en: 'My uncle always gave me candy.', es: 'mi tío | siempre | me | {V} | dulces', verb: 'dar', person: 'el', tense: 'imperfect', cue: 'siempre' },
  { id: 'imp-hacer', en: 'They used to do yoga every morning.', es: '(ellos) | {V} | yoga | todas las mañanas', alt: ['todas las mañanas | (ellos) | {V} | yoga'], verb: 'hacer', person: 'ellos', tense: 'imperfect', cue: 'todas las mañanas' },
  { id: 'imp-estudiar', en: 'Every afternoon we studied in the library.', es: 'todas las tardes | (nosotros) | {V} | en la biblioteca', alt: ['(nosotros) | {V} | en la biblioteca | todas las tardes'], verb: 'estudiar', person: 'nosotros', tense: 'imperfect', cue: 'todas las tardes' },
  { id: 'imp-traer', en: 'You always used to bring flowers.', es: '(tú) | siempre | {V} | flores', verb: 'traer', person: 'tu', tense: 'imperfect', cue: 'siempre' },
  { id: 'imp-poder', en: 'Before, we could play outside all day.', es: 'antes | (nosotros) | {V} | jugar afuera | todo el día', alt: ['(nosotros) | {V} | jugar afuera | todo el día | antes'], verb: 'poder', person: 'nosotros', tense: 'imperfect', cue: 'antes' },
  { id: 'imp-tocar', en: 'My grandpa used to play the guitar.', es: 'mi abuelo | {V} | la guitarra', verb: 'tocar', person: 'el', tense: 'imperfect', hint: '“Used to” in English is the classic signal for the imperfect.' },

  // ── Present ───────────────────────────────────────────────────────────
  { id: 'pres-hablar', en: 'I speak Spanish every day.', es: '(yo) | {V} | español | todos los días', alt: ['todos los días | (yo) | {V} | español'], verb: 'hablar', person: 'yo', tense: 'present', cue: 'todos los días', hint: 'A current habit (I speak…, not I used to speak…) → present.' },
  { id: 'pres-tener', en: 'Now I have a dog.', es: 'ahora | (yo) | {V} | un perro', alt: ['(yo) | ahora | {V} | un perro', '(yo) | {V} | un perro | ahora'], verb: 'tener', person: 'yo', tense: 'present', cue: 'ahora' },
  { id: 'pres-hacer', en: 'My mom makes coffee every morning.', es: 'mi mamá | {V} | café | todas las mañanas', alt: ['todas las mañanas | mi mamá | {V} | café'], verb: 'hacer', person: 'el', tense: 'present', cue: 'todas las mañanas', hint: 'A habit that is still true now → present.' },
  { id: 'pres-ir', en: "Today I'm going to the market.", es: 'hoy | (yo) | {V} | al mercado', alt: ['(yo) | {V} | al mercado | hoy'], verb: 'ir', person: 'yo', tense: 'present', cue: 'hoy' },
  { id: 'pres-querer', en: 'They want to eat now.', es: '(ellos) | {V} | comer | ahora', alt: ['ahora | (ellos) | {V} | comer'], verb: 'querer', person: 'ellos', tense: 'present', cue: 'ahora' },
  { id: 'pres-poder', en: 'You can come to the party.', es: '(tú) | {V} | venir | a la fiesta', verb: 'poder', person: 'tu', tense: 'present', hint: 'Present ability → present tense (o → ue stem change).' },
  { id: 'pres-dormir', en: 'I usually sleep eight hours.', es: 'normalmente | (yo) | {V} | ocho horas', alt: ['(yo) | normalmente | {V} | ocho horas', '(yo) | {V} | ocho horas | normalmente'], verb: 'dormir', person: 'yo', tense: 'present', cue: 'normalmente' },
  { id: 'pres-jugar', en: 'The kids play in the park.', es: 'los niños | {V} | en el parque', verb: 'jugar', person: 'ellos', tense: 'present', hint: 'General present → present tense (u → ue: juegan).' },
  { id: 'pres-pedir', en: 'I usually order water.', es: 'normalmente | (yo) | {V} | agua', alt: ['(yo) | normalmente | {V} | agua'], verb: 'pedir', person: 'yo', tense: 'present', cue: 'normalmente' },
  { id: 'pres-pensar', en: 'She thinks a lot.', es: '(ella) | {V} | mucho', verb: 'pensar', person: 'el', tense: 'present', hint: 'Present tense, e → ie stem change: piensa.' },
  { id: 'pres-volver', en: 'We come back home at six.', es: '(nosotros) | {V} | a casa | a las seis', verb: 'volver', person: 'nosotros', tense: 'present', hint: 'Nosotros never stem-changes in the present: volvemos.' },
  { id: 'pres-estar', en: 'Today you all are tired.', es: 'hoy | (vosotros) | {V} | cansados', alt: ['(vosotros) | {V} | cansados | hoy'], verb: 'estar', person: 'vosotros', tense: 'present', cue: 'hoy' },
  { id: 'pres-saber', en: 'I know the answer.', es: '(yo) | {V} | la respuesta', verb: 'saber', person: 'yo', tense: 'present', hint: 'Saber = knowing a fact. Irregular yo: sé.' },
  { id: 'pres-salir', en: 'On Fridays I go out with my friends.', es: 'los viernes | (yo) | {V} | con mis amigos', alt: ['(yo) | {V} | con mis amigos | los viernes'], verb: 'salir', person: 'yo', tense: 'present', cue: 'los viernes' },
  { id: 'pres-conocer', en: 'I know María.', es: '(yo) | {V} | a María', verb: 'conocer', person: 'yo', tense: 'present', hint: 'Conocer = knowing a person. Irregular yo: conozco.' },
  { id: 'pres-ser', en: 'You are my best friend.', es: '(tú) | {V} | mi mejor amigo', verb: 'ser', person: 'tu', tense: 'present' },
  { id: 'pres-poner', en: "Now I'm putting the keys on the table.", es: 'ahora | (yo) | {V} | las llaves | en la mesa', alt: ['(yo) | {V} | las llaves | en la mesa | ahora'], verb: 'poner', person: 'yo', tense: 'present', cue: 'ahora' },
  { id: 'pres-leer', en: 'My parents read the newspaper every morning.', es: 'mis padres | {V} | el periódico | cada mañana', alt: ['cada mañana | mis padres | {V} | el periódico'], verb: 'leer', person: 'ellos', tense: 'present', cue: 'cada mañana' },
  { id: 'pres-beber', en: 'You all drink a lot of water.', es: '(vosotros) | {V} | mucha agua', verb: 'beber', person: 'vosotros', tense: 'present' },
  { id: 'pres-traer', en: "Today I'm bringing dessert.", es: 'hoy | (yo) | {V} | el postre', alt: ['(yo) | {V} | el postre | hoy'], verb: 'traer', person: 'yo', tense: 'present', cue: 'hoy' },
  { id: 'pres-decir', en: 'You always tell the truth.', es: '(tú) | siempre | {V} | la verdad', verb: 'decir', person: 'tu', tense: 'present', hint: 'English “tell” (not “told” / “used to tell”) → present. Decir: e → i, dices.' },
  { id: 'pres-venir', en: 'Today they are coming to dinner.', es: 'hoy | (ellos) | {V} | a cenar', alt: ['(ellos) | {V} | a cenar | hoy'], verb: 'venir', person: 'ellos', tense: 'present', cue: 'hoy' },
  { id: 'pres-aprender', en: 'We are learning a lot.', es: '(nosotros) | {V} | mucho', verb: 'aprender', person: 'nosotros', tense: 'present' },
];

const DEFAULT_HINT: Record<Tense, (cue: string) => string> = {
  preterite: (cue) => `“${cue}” points to a finished, one-time action → preterite.`,
  imperfect: (cue) => `“${cue}” signals a habit or ongoing background in the past → imperfect.`,
  present: (cue) => `“${cue}” — this is happening now or regularly now → present.`,
};

export function hintFor(s: Sentence): string | undefined {
  if (s.hint) return s.hint;
  if (s.cue) return DEFAULT_HINT[s.tense](s.cue);
  return undefined;
}
