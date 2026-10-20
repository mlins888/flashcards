import { forwardRef, useImperativeHandle, useRef } from 'react';

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'];

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  submitLabel?: string;
  multiline?: boolean;
}

export interface AnswerInputHandle {
  focus: () => void;
}

/** Text input with an á é í ó ú ñ ü bar that inserts at the cursor. */
export const AnswerInput = forwardRef<AnswerInputHandle, Props>(function AnswerInput(
  { value, onChange, onSubmit, label, placeholder, disabled, submitLabel = 'Check', multiline },
  ref,
) {
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

  const insert = (ch: string) => {
    const el = inputRef.current;
    if (!el) return onChange(value + ch);
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + ch + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  const common = {
    ref: inputRef,
    value,
    disabled,
    placeholder,
    'aria-label': label,
    autoComplete: 'off',
    autoCapitalize: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !(multiline && e.shiftKey)) {
        e.preventDefault();
        onSubmit();
      }
    },
  };

  return (
    <form
      className="answer"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="answer-row">
        {multiline ? <textarea rows={2} {...common} /> : <input type="text" {...common} />}
        <button type="submit" className="btn primary" disabled={disabled}>
          {submitLabel}
        </button>
      </div>
      <div className="accent-bar" aria-label="Insert accented letter">
        {ACCENTS.map((a) => (
          <button key={a} type="button" className="accent-key" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(a)}>
            {a}
          </button>
        ))}
      </div>
    </form>
  );
});
