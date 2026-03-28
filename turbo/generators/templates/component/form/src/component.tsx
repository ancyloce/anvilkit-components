import type { CSSProperties } from 'react';

export interface {{componentName}}Props {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface {{componentName}}ViewProps extends {{componentName}}Props {
  editMode?: boolean;
}

const inputStyle: CSSProperties = {
  appearance: 'none',
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '0.9rem',
  color: '#0f172a',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  lineHeight: 1.4,
  minWidth: '16rem',
  outline: 'none',
  padding: '0.75rem 0.9rem',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
};

const disabledStyle: CSSProperties = {
  backgroundColor: '#f8fafc',
  color: '#94a3b8',
  cursor: 'not-allowed',
};

export function {{componentName}}({
  label,
  name,
  type = 'text',
  placeholder,
  helperText,
  defaultValue,
  required = false,
  disabled = false,
  editMode = false,
}: {{componentName}}ViewProps) {
  const isDisabled = disabled || editMode;
  const style = {
    ...inputStyle,
    ...(isDisabled ? disabledStyle : {}),
  } satisfies CSSProperties;

  const labelStyle = {
    color: '#0f172a',
    display: 'grid',
    fontFamily: 'inherit',
    gap: '0.45rem',
  } satisfies CSSProperties;

  const labelTextStyle = {
    fontSize: '0.95rem',
    fontWeight: 600,
  } satisfies CSSProperties;

  const helperTextStyle = {
    color: '#475569',
    fontSize: '0.85rem',
    lineHeight: 1.5,
  } satisfies CSSProperties;

  return (
    <label style={labelStyle}>
      <span style={labelTextStyle}>
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={isDisabled}
        readOnly={editMode}
        required={required}
        aria-disabled={isDisabled || undefined}
        style={style}
      />
      {helperText ? <span style={helperTextStyle}>{helperText}</span> : null}
    </label>
  );
}
