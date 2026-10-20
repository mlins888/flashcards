import type { Verb } from '../engine/types';

const SER_IR_PRETERITE = {
  yo: 'fui',
  tu: 'fuiste',
  el: 'fue',
  nosotros: 'fuimos',
  vosotros: 'fuisteis',
  ellos: 'fueron',
};

export const VERBS: Verb[] = [
  // Regular
  { inf: 'hablar', en: 'to speak' },
  { inf: 'comer', en: 'to eat' },
  { inf: 'vivir', en: 'to live' },
  { inf: 'trabajar', en: 'to work' },
  { inf: 'estudiar', en: 'to study' },
  { inf: 'comprar', en: 'to buy' },
  { inf: 'bailar', en: 'to dance' },
  { inf: 'beber', en: 'to drink' },
  { inf: 'aprender', en: 'to learn' },
  { inf: 'escribir', en: 'to write' },
  { inf: 'abrir', en: 'to open' },

  // Spelling changes in the preterite yo form
  { inf: 'buscar', en: 'to look for' },
  { inf: 'tocar', en: 'to play (an instrument) / touch' },
  { inf: 'llegar', en: 'to arrive' },
  { inf: 'leer', en: 'to read' },

  // Stem-changers
  { inf: 'pensar', en: 'to think', stemChange: 'e>ie' },
  { inf: 'empezar', en: 'to start', stemChange: 'e>ie' },
  { inf: 'volver', en: 'to return', stemChange: 'o>ue' },
  { inf: 'dormir', en: 'to sleep', stemChange: 'o>ue' },
  { inf: 'pedir', en: 'to ask for / order', stemChange: 'e>i' },
  { inf: 'jugar', en: 'to play (a game)', stemChange: 'u>ue' },
  { inf: 'poder', en: 'to be able to', stemChange: 'o>ue', preteriteStem: 'pud' },
  { inf: 'querer', en: 'to want', stemChange: 'e>ie', preteriteStem: 'quis' },

  // Irregular
  {
    inf: 'ser',
    en: 'to be (essence)',
    present: { yo: 'soy', tu: 'eres', el: 'es', nosotros: 'somos', vosotros: 'sois', ellos: 'son' },
    preterite: SER_IR_PRETERITE,
    imperfect: { yo: 'era', tu: 'eras', el: 'era', nosotros: 'éramos', vosotros: 'erais', ellos: 'eran' },
  },
  {
    inf: 'estar',
    en: 'to be (state / location)',
    present: { yo: 'estoy', tu: 'estás', el: 'está', nosotros: 'estamos', vosotros: 'estáis', ellos: 'están' },
    preteriteStem: 'estuv',
  },
  {
    inf: 'ir',
    en: 'to go',
    present: { yo: 'voy', tu: 'vas', el: 'va', nosotros: 'vamos', vosotros: 'vais', ellos: 'van' },
    preterite: SER_IR_PRETERITE,
    imperfect: { yo: 'iba', tu: 'ibas', el: 'iba', nosotros: 'íbamos', vosotros: 'ibais', ellos: 'iban' },
  },
  { inf: 'tener', en: 'to have', stemChange: 'e>ie', yo: 'tengo', preteriteStem: 'tuv' },
  { inf: 'venir', en: 'to come', stemChange: 'e>ie', yo: 'vengo', preteriteStem: 'vin' },
  { inf: 'hacer', en: 'to do / make', yo: 'hago', preteriteStem: 'hic', preterite: { el: 'hizo' } },
  { inf: 'decir', en: 'to say / tell', stemChange: 'e>i', yo: 'digo', preteriteStem: 'dij' },
  { inf: 'traer', en: 'to bring', yo: 'traigo', preteriteStem: 'traj' },
  { inf: 'poner', en: 'to put', yo: 'pongo', preteriteStem: 'pus' },
  { inf: 'saber', en: 'to know (facts)', yo: 'sé', preteriteStem: 'sup' },
  { inf: 'salir', en: 'to go out / leave', yo: 'salgo' },
  { inf: 'conocer', en: 'to know (people / places)', yo: 'conozco' },
  {
    inf: 'dar',
    en: 'to give',
    yo: 'doy',
    present: { vosotros: 'dais' },
    preterite: { yo: 'di', tu: 'diste', el: 'dio', nosotros: 'dimos', vosotros: 'disteis', ellos: 'dieron' },
  },
  {
    inf: 'ver',
    en: 'to see / watch',
    yo: 'veo',
    present: { vosotros: 'veis' },
    preterite: { yo: 'vi', tu: 'viste', el: 'vio', nosotros: 'vimos', vosotros: 'visteis', ellos: 'vieron' },
    imperfect: { yo: 'veía', tu: 'veías', el: 'veía', nosotros: 'veíamos', vosotros: 'veíais', ellos: 'veían' },
  },
];

export const VERB_BY_INF: Record<string, Verb> = Object.fromEntries(VERBS.map((v) => [v.inf, v]));

export function getVerb(inf: string): Verb {
  const v = VERB_BY_INF[inf];
  if (!v) throw new Error(`Unknown verb: ${inf}`);
  return v;
}
