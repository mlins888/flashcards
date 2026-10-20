import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/store';

export function ModeLayout({ title, subtitle, stage, children }: { title: string; subtitle: string; stage: ReactNode; children: ReactNode }) {
  const streak = useApp((s) => s.stats.streak);
  return (
    <div className="mode">
      <header className="mode-header">
        <Link to="/" className="back" aria-label="Back to home">
          ←
        </Link>
        <div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="streak" title="Current streak">
          🔥 {streak}
        </div>
      </header>
      {stage}
      <section className="panel">{children}</section>
    </div>
  );
}
