import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Grade } from '../engine/grade';
import { review, type SrsState } from '../engine/srs';
import { TENSES, itemKey, type Person, type Tense } from '../engine/types';
import type { PracticeSettings } from '../engine/generators';

interface Stats {
  answered: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

interface AppState {
  settings: PracticeSettings;
  srs: SrsState;
  stats: Stats;
  setTenses: (tenses: Tense[]) => void;
  setVosotros: (on: boolean) => void;
  record: (verb: string, tense: Tense, person: Person, result: Grade) => void;
  resetProgress: () => void;
}

const EMPTY_STATS: Stats = { answered: 0, correct: 0, streak: 0, bestStreak: 0 };

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      settings: { tenses: [...TENSES], vosotros: false },
      srs: {},
      stats: EMPTY_STATS,
      setTenses: (tenses) => set((s) => ({ settings: { ...s.settings, tenses } })),
      setVosotros: (vosotros) => set((s) => ({ settings: { ...s.settings, vosotros } })),
      record: (verb, tense, person, result) =>
        set((s) => {
          const key = itemKey(verb, tense, person);
          const ok = result === 'correct';
          const streak = ok ? s.stats.streak + 1 : 0;
          return {
            srs: { ...s.srs, [key]: review(s.srs[key], result) },
            stats: {
              answered: s.stats.answered + 1,
              correct: s.stats.correct + (ok ? 1 : 0),
              streak,
              bestStreak: Math.max(s.stats.bestStreak, streak),
            },
          };
        }),
      resetProgress: () => set({ srs: {}, stats: EMPTY_STATS }),
    }),
    {
      name: 'verbos3d',
      version: 1,
      storage: createJSONStorage(() => {
        try {
          return localStorage;
        } catch {
          return sessionStorage;
        }
      }),
      partialize: (s) => ({ settings: s.settings, srs: s.srs, stats: s.stats }),
    },
  ),
);
