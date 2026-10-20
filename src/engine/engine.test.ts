import { describe, expect, it } from 'vitest';
import { grade, gradeAny } from './grade';
import { review, weight, BOX_COUNT, INTERVALS } from './srs';
import { acceptedOrders, checkAssembly, chunksFor, fullSentence } from './sentence';
import { verbDecoys } from './generators';
import { conjugate } from './conjugate';
import { SENTENCES } from '../data/sentences';
import { VERB_BY_INF, getVerb } from '../data/verbs';
import { SUBJECTS } from '../data/subjects';
import { PERSONS } from './types';

describe('grade', () => {
  it('accepts exact answers regardless of case and spacing', () => {
    expect(grade('  Comió ', 'comió')).toBe('correct');
  });
  it('flags accent-only mistakes as almost', () => {
    expect(grade('comio', 'comió')).toBe('almost');
    expect(grade('ano', 'año')).toBe('almost');
  });
  it('rejects wrong forms', () => {
    expect(grade('comía', 'comió')).toBe('wrong');
    expect(grade('', 'comió')).toBe('wrong');
  });
  it('gradeAny takes the best match', () => {
    expect(gradeAny('hablo', ['hablé', 'hablo'])).toBe('correct');
    expect(gradeAny('hable', ['hablé', 'xx'])).toBe('almost');
  });
});

describe('srs', () => {
  const now = 1_000_000;
  it('promotes on correct and schedules the next review', () => {
    const e = review(undefined, 'correct', now);
    expect(e.box).toBe(2);
    expect(e.due).toBe(now + INTERVALS[1]);
    expect(review(e, 'correct', now).box).toBe(3);
  });
  it('caps at the top box', () => {
    let e = review(undefined, 'correct', now);
    for (let i = 0; i < 10; i++) e = review(e, 'correct', now);
    expect(e.box).toBe(BOX_COUNT);
  });
  it('resets on wrong and steps down on almost', () => {
    const e = { box: 4, due: now, seen: 3, correct: 3 };
    expect(review(e, 'wrong', now).box).toBe(1);
    expect(review(e, 'almost', now).box).toBe(3);
  });
  it('weights due, weak items above mastered ones', () => {
    expect(weight({ box: 1, due: now - 1, seen: 1, correct: 0 }, now)).toBeGreaterThan(
      weight({ box: 5, due: now + 1e9, seen: 9, correct: 9 }, now),
    );
  });
});

describe('sentence bank', () => {
  it('references known verbs and has exactly one verb slot', () => {
    for (const s of SENTENCES) {
      expect(VERB_BY_INF[s.verb], s.id).toBeDefined();
      for (const pattern of [s.es, ...(s.alt ?? [])]) expect(pattern.split('{V}').length - 1, s.id).toBe(1);
    }
  });
  it('has unique ids', () => {
    expect(new Set(SENTENCES.map((s) => s.id)).size).toBe(SENTENCES.length);
  });
  it('builds the full sentence with the conjugated verb', () => {
    const s = SENTENCES.find((x) => x.id === 'pret-comer')!;
    expect(fullSentence(s)).toBe('Ayer nosotros comimos tacos.');
  });
  it('accepts pro-drop and alternate orders', () => {
    const s = SENTENCES.find((x) => x.id === 'pret-comer')!;
    expect(checkAssembly(s, ['ayer', 'nosotros', 'comimos', 'tacos'])).toBe(true);
    expect(checkAssembly(s, ['ayer', 'comimos', 'tacos'])).toBe(true);
    expect(checkAssembly(s, ['comimos', 'tacos', 'ayer'])).toBe(true);
    expect(checkAssembly(s, ['ayer', 'nosotros', 'comíamos', 'tacos'])).toBe(false);
    expect(checkAssembly(s, ['tacos', 'comimos', 'ayer'])).toBe(false);
  });
  it('every sentence accepts its own canonical chunk order', () => {
    for (const s of SENTENCES) {
      const words = chunksFor(s).map((c) => c.text);
      expect(checkAssembly(s, words), s.id).toBe(true);
      expect(acceptedOrders(s).length).toBeGreaterThan(0);
    }
  });
});

describe('verbDecoys', () => {
  it('never includes the answer and has no duplicates', () => {
    const settings = { tenses: [], vosotros: true };
    for (const p of PERSONS) {
      const verb = getVerb('vivir');
      const decoys = verbDecoys(verb, 'present', p, settings);
      expect(decoys).not.toContain(conjugate(verb, 'present', p));
      expect(new Set(decoys).size).toBe(decoys.length);
      expect(decoys.length).toBe(3);
    }
  });
});

describe('subjects', () => {
  it('cover every person', () => {
    for (const p of PERSONS) expect(SUBJECTS.some((s) => s.person === p)).toBe(true);
  });
});
