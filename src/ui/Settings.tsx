import { Link } from 'react-router-dom';
import { TENSES, TENSE_LABEL, type Tense } from '../engine/types';
import { useApp } from '../state/store';
import { TenseChip } from './TenseToggle';

export function Settings() {
  const settings = useApp((s) => s.settings);
  const setTenses = useApp((s) => s.setTenses);
  const setVosotros = useApp((s) => s.setVosotros);
  const resetProgress = useApp((s) => s.resetProgress);

  const toggleTense = (t: Tense, on: boolean) => {
    const next = on ? [...settings.tenses, t] : settings.tenses.filter((x) => x !== t);
    if (next.length) setTenses(TENSES.filter((x) => next.includes(x)));
  };

  return (
    <div className="mode settings">
      <header className="mode-header">
        <Link to="/" className="back" aria-label="Back to home">
          ←
        </Link>
        <div>
          <h1>Settings</h1>
        </div>
      </header>

      <section className="panel">
        <fieldset>
          <legend>Tenses to practice</legend>
          {TENSES.map((t) => (
            <label key={t} className="check">
              <input
                type="checkbox"
                checked={settings.tenses.includes(t)}
                disabled={settings.tenses.length === 1 && settings.tenses.includes(t)}
                onChange={(e) => toggleTense(t, e.target.checked)}
              />
              <span>
                <TenseChip tense={t} /> <span className="sr-only">{TENSE_LABEL[t]}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Persons</legend>
          <label className="check">
            <input type="checkbox" checked={settings.vosotros} onChange={(e) => setVosotros(e.target.checked)} />
            <span>
              Include <b>vosotros</b>
              <br />
              <span className="muted">Used in Spain. Latin America uses ustedes (same form as ellos) instead.</span>
            </span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Progress</legend>
          <p className="muted" style={{ margin: 0 }}>
            Your progress is saved in this browser only.
          </p>
          <div>
            <button
              className="btn"
              onClick={() => {
                if (confirm('Erase all progress? This cannot be undone.')) resetProgress();
              }}
            >
              Reset progress
            </button>
          </div>
        </fieldset>
      </section>
    </div>
  );
}
