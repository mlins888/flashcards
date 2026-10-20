import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ProgressSummary } from './ProgressSummary';

const HeroDeck = lazy(() => import('../three/HeroDeck').then((m) => ({ default: m.HeroDeck })));

const MODES = [
  { to: '/grid', title: 'Conjugation grid', body: 'One verb, every person. A quick warm-up of yo → ellos.' },
  { to: '/context', title: 'Conjugate in context', body: 'A sentence with a blank. Read the time clue: preterite or imperfect?' },
  { to: '/assemble', title: 'Build the sentence', body: 'Drag word cards into order and pick the right verb from the decoys.' },
  { to: '/slots', title: 'Sentence slots', body: 'Spin subject, verb and tense, then conjugate and write your own sentence.' },
];

export function Home() {
  return (
    <main className="home">
      <div className="topbar">
        <span className="brand">Verbos 3D</span>
        <Link to="/settings" className="btn ghost small">
          ⚙ Settings
        </Link>
      </div>

      <section className="hero">
        <div>
          <h1>
            Stop flipping words.
            <br />
            <em>Start building sentences.</em>
          </h1>
          <p>Practice Spanish verbs in every person, across the present, preterite and imperfect, with cards you can actually pick up.</p>
          <Link to="/context" className="btn primary">
            Start practicing →
          </Link>
        </div>
        <Suspense fallback={<div className="stage hero-stage" />}>
          <HeroDeck />
        </Suspense>
      </section>

      <nav className="modes" aria-label="Practice modes">
        {MODES.map((m, i) => (
          <Link key={m.to} to={m.to} className="mode-card">
            <span className="num">0{i + 1}</span>
            <h2>{m.title}</h2>
            <p>{m.body}</p>
          </Link>
        ))}
      </nav>

      <ProgressSummary />
    </main>
  );
}
