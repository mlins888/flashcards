import { TENSE_LABEL, type Tense } from '../engine/types';
import { TENSE_COLOR } from '../three/theme';

export function TenseToggle({ tenses, value, onChange }: { tenses: Tense[]; value: Tense; onChange: (t: Tense) => void }) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Tense">
      {tenses.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={value === t}
          className={value === t ? 'on' : ''}
          style={{ ['--tense' as string]: TENSE_COLOR[t] }}
          onClick={() => onChange(t)}
        >
          {TENSE_LABEL[t]}
        </button>
      ))}
    </div>
  );
}

export function TenseChip({ tense }: { tense: Tense }) {
  return (
    <span className="tense-chip" style={{ ['--tense' as string]: TENSE_COLOR[tense] }}>
      {TENSE_LABEL[tense]}
    </span>
  );
}
