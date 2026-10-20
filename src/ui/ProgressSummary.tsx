import { VERBS } from '../data/verbs';
import { activePersons } from '../engine/generators';
import { mastery } from '../engine/srs';
import { PERSON_SHORT, TENSES, TENSE_LABEL, itemKey, type Person, type Tense } from '../engine/types';
import { useApp } from '../state/store';
import { TENSE_COLOR } from '../three/theme';

/** Average mastery and how many verbs have been practiced for one tense × person cell. */
function cell(srs: ReturnType<typeof useApp.getState>['srs'], tense: Tense, person: Person) {
  let sum = 0;
  let seen = 0;
  for (const v of VERBS) {
    const e = srs[itemKey(v.inf, tense, person)];
    if (!e) continue;
    seen++;
    sum += mastery(e);
  }
  return { seen, avg: seen ? sum / seen : 0 };
}

export function ProgressSummary() {
  const srs = useApp((s) => s.srs);
  const stats = useApp((s) => s.stats);
  const settings = useApp((s) => s.settings);
  const persons = activePersons(settings);
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <section className="progress" aria-labelledby="progress-h">
      <div>
        <h2 id="progress-h">Your verb map</h2>
        <table className="heatmap">
          <thead>
            <tr>
              <th />
              {persons.map((p) => (
                <th key={p} scope="col">
                  {PERSON_SHORT[p]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TENSES.map((t) => (
              <tr key={t}>
                <th scope="row">{TENSE_LABEL[t]}</th>
                {persons.map((p) => {
                  const { seen, avg } = cell(srs, t, p);
                  const pct = Math.round(avg * 100);
                  return (
                    <td
                      key={p}
                      title={seen ? `${seen} verbs practiced · ${pct}% mastered` : 'Not practiced yet'}
                      style={
                        seen
                          ? {
                              background: `color-mix(in srgb, ${TENSE_COLOR[t]} ${18 + avg * 70}%, var(--surface))`,
                              color: avg > 0.5 ? '#17131f' : 'var(--text)',
                            }
                          : undefined
                      }
                    >
                      {seen ? `${pct}%` : '·'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">Darker = more mastered. Cells you miss come back sooner in every mode.</p>
      </div>
      <div className="stats">
        <div className="stat">
          <b>{stats.answered}</b>
          <span>answered</span>
        </div>
        <div className="stat">
          <b>{accuracy}%</b>
          <span>accuracy</span>
        </div>
        <div className="stat">
          <b>{stats.bestStreak}</b>
          <span>best streak</span>
        </div>
      </div>
    </section>
  );
}
