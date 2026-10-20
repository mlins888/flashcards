import { describe, expect, it } from 'vitest';
import { conjugate } from './conjugate';
import { getVerb, VERBS } from '../data/verbs';
import { PERSONS, TENSES, type Tense } from './types';

// Each row: yo, tú, él, nosotros, vosotros, ellos
const TABLES: Record<string, Record<Tense, string>> = {
  hablar: {
    present: 'hablo hablas habla hablamos habláis hablan',
    preterite: 'hablé hablaste habló hablamos hablasteis hablaron',
    imperfect: 'hablaba hablabas hablaba hablábamos hablabais hablaban',
  },
  comer: {
    present: 'como comes come comemos coméis comen',
    preterite: 'comí comiste comió comimos comisteis comieron',
    imperfect: 'comía comías comía comíamos comíais comían',
  },
  vivir: {
    present: 'vivo vives vive vivimos vivís viven',
    preterite: 'viví viviste vivió vivimos vivisteis vivieron',
    imperfect: 'vivía vivías vivía vivíamos vivíais vivían',
  },
  tener: {
    present: 'tengo tienes tiene tenemos tenéis tienen',
    preterite: 'tuve tuviste tuvo tuvimos tuvisteis tuvieron',
    imperfect: 'tenía tenías tenía teníamos teníais tenían',
  },
  ser: {
    present: 'soy eres es somos sois son',
    preterite: 'fui fuiste fue fuimos fuisteis fueron',
    imperfect: 'era eras era éramos erais eran',
  },
  ir: {
    present: 'voy vas va vamos vais van',
    preterite: 'fui fuiste fue fuimos fuisteis fueron',
    imperfect: 'iba ibas iba íbamos ibais iban',
  },
  estar: {
    present: 'estoy estás está estamos estáis están',
    preterite: 'estuve estuviste estuvo estuvimos estuvisteis estuvieron',
    imperfect: 'estaba estabas estaba estábamos estabais estaban',
  },
  hacer: {
    present: 'hago haces hace hacemos hacéis hacen',
    preterite: 'hice hiciste hizo hicimos hicisteis hicieron',
    imperfect: 'hacía hacías hacía hacíamos hacíais hacían',
  },
  pedir: {
    present: 'pido pides pide pedimos pedís piden',
    preterite: 'pedí pediste pidió pedimos pedisteis pidieron',
    imperfect: 'pedía pedías pedía pedíamos pedíais pedían',
  },
  dormir: {
    present: 'duermo duermes duerme dormimos dormís duermen',
    preterite: 'dormí dormiste durmió dormimos dormisteis durmieron',
    imperfect: 'dormía dormías dormía dormíamos dormíais dormían',
  },
  jugar: {
    present: 'juego juegas juega jugamos jugáis juegan',
    preterite: 'jugué jugaste jugó jugamos jugasteis jugaron',
    imperfect: 'jugaba jugabas jugaba jugábamos jugabais jugaban',
  },
  buscar: {
    present: 'busco buscas busca buscamos buscáis buscan',
    preterite: 'busqué buscaste buscó buscamos buscasteis buscaron',
    imperfect: 'buscaba buscabas buscaba buscábamos buscabais buscaban',
  },
  llegar: {
    present: 'llego llegas llega llegamos llegáis llegan',
    preterite: 'llegué llegaste llegó llegamos llegasteis llegaron',
    imperfect: 'llegaba llegabas llegaba llegábamos llegabais llegaban',
  },
  empezar: {
    present: 'empiezo empiezas empieza empezamos empezáis empiezan',
    preterite: 'empecé empezaste empezó empezamos empezasteis empezaron',
    imperfect: 'empezaba empezabas empezaba empezábamos empezabais empezaban',
  },
  leer: {
    present: 'leo lees lee leemos leéis leen',
    preterite: 'leí leíste leyó leímos leísteis leyeron',
    imperfect: 'leía leías leía leíamos leíais leían',
  },
  decir: {
    present: 'digo dices dice decimos decís dicen',
    preterite: 'dije dijiste dijo dijimos dijisteis dijeron',
    imperfect: 'decía decías decía decíamos decíais decían',
  },
  traer: {
    present: 'traigo traes trae traemos traéis traen',
    preterite: 'traje trajiste trajo trajimos trajisteis trajeron',
    imperfect: 'traía traías traía traíamos traíais traían',
  },
  dar: {
    present: 'doy das da damos dais dan',
    preterite: 'di diste dio dimos disteis dieron',
    imperfect: 'daba dabas daba dábamos dabais daban',
  },
  ver: {
    present: 'veo ves ve vemos veis ven',
    preterite: 'vi viste vio vimos visteis vieron',
    imperfect: 'veía veías veía veíamos veíais veían',
  },
  poder: {
    present: 'puedo puedes puede podemos podéis pueden',
    preterite: 'pude pudiste pudo pudimos pudisteis pudieron',
    imperfect: 'podía podías podía podíamos podíais podían',
  },
  venir: {
    present: 'vengo vienes viene venimos venís vienen',
    preterite: 'vine viniste vino vinimos vinisteis vinieron',
    imperfect: 'venía venías venía veníamos veníais venían',
  },
  conocer: {
    present: 'conozco conoces conoce conocemos conocéis conocen',
    preterite: 'conocí conociste conoció conocimos conocisteis conocieron',
    imperfect: 'conocía conocías conocía conocíamos conocíais conocían',
  },
};

describe('conjugate', () => {
  for (const [inf, tenses] of Object.entries(TABLES)) {
    for (const tense of TENSES) {
      it(`${inf} — ${tense}`, () => {
        const verb = getVerb(inf);
        const actual = PERSONS.map((p) => conjugate(verb, tense, p)).join(' ');
        expect(actual).toBe(tenses[tense]);
      });
    }
  }

  it('produces a non-empty form for every verb, tense and person', () => {
    for (const verb of VERBS)
      for (const tense of TENSES)
        for (const person of PERSONS) expect(conjugate(verb, tense, person)).toMatch(/^[a-záéíóúñü]+$/);
  });
});
