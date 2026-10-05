import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string | null;
}

export function Input({ label, errorMessage, id, type, ...rest }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <div className="field-input-wrapper">
        <input
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            className="field-toggle-visibility"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={visible}
            tabIndex={-1}
          >
            {visible ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 2l20 20M9.88 9.88a3 3 0 0 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.16 13.16 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        ) : null}
      </div>
      {errorMessage ? <span className="field-error">{errorMessage}</span> : null}
    </div>
  );
}
