# Verbos 3D

Spanish verb practice with real 3D cards. It drills every person (yo → ellos, with vosotros optional) across the **present**, **preterite** and **imperfect** tenses, and it focuses on building whole sentences instead of flipping single words.

Built with Vite, React, TypeScript, React Three Fiber (three.js) and zustand.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # conjugation engine, grading, spaced repetition, sentence bank
npm run build    # type-check + production build into dist/
```

## Practice modes

| Mode | What you do |
| --- | --- |
| **Conjugation grid** | One verb, one tense: type the form for each person. Right answers flip the card; wrong ones shake. |
| **Conjugate in context** | A sentence with a blank (“Ayer nosotros ___ tacos”). Use the time clue to pick the tense. |
| **Build the sentence** | Drag or tap word cards into the rail to match the English. Decoy verb cards use the wrong person or tense. |
| **Sentence slots** | Spin subject + verb + tense, conjugate it, then write your own sentence. |

Every answer feeds a Leitner spaced-repetition box for that `verb | tense | person`, and all modes pick weak and due forms more often. The home page shows a tense × person heatmap. Progress is stored in `localStorage`.

## Adding content

- **Verbs**: `src/data/verbs.ts`. Regular verbs need only `{ inf, en }`. You can add `stemChange`, an irregular `yo` form, a strong `preteriteStem` (tuv-, hic-…), or per-tense overrides. Add the full table to `src/engine/conjugate.test.ts` to lock it in.
- **Sentences**: `src/data/sentences.ts`. Chunks are pipe-separated, `{V}` is filled in by the conjugation engine, `(…)` marks optional words (usually the subject pronoun), and `alt` lists other accepted word orders. `npm test` checks every sentence.

## Layout

```
src/engine/   conjugation rules, grading, spaced repetition, question generators (pure, tested)
src/data/     verbs, subjects, sentence bank
src/three/    Card3D, CardTable (canvas + camera fit), SentenceRail, SlotReel, HeroDeck
src/modes/    the four practice screens
src/ui/       home, settings, inputs, feedback
```
