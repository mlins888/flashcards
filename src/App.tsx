import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from './ui/Home';
import { Settings } from './ui/Settings';

const GridDrill = lazy(() => import('./modes/GridDrill').then((m) => ({ default: m.GridDrill })));
const ContextConjugate = lazy(() => import('./modes/ContextConjugate').then((m) => ({ default: m.ContextConjugate })));
const SentenceAssemble = lazy(() => import('./modes/SentenceAssemble').then((m) => ({ default: m.SentenceAssemble })));
const SentenceSlots = lazy(() => import('./modes/SentenceSlots').then((m) => ({ default: m.SentenceSlots })));

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="loading">Shuffling the deck…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grid" element={<GridDrill />} />
          <Route path="/context" element={<ContextConjugate />} />
          <Route path="/assemble" element={<SentenceAssemble />} />
          <Route path="/slots" element={<SentenceSlots />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
