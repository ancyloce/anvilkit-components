import type { CSSProperties, ReactNode } from 'react';
import type { Slot } from '@puckeditor/core';

export interface {{componentName}}Props {
  title: string;
  leftColumn: Slot;
  rightColumn: Slot;
  emphasis?: 'balanced' | 'accent';
}

export interface {{componentName}}ViewProps {
  title: string;
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  emphasis?: 'balanced' | 'accent';
  editMode?: boolean;
}

const emphasisStyles: Record<NonNullable<{{componentName}}ViewProps['emphasis']>, CSSProperties> = {
  balanced: {
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  },
  accent: {
    background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)',
  },
};

export function {{componentName}}({
  title,
  leftColumn,
  rightColumn,
  emphasis = 'balanced',
  editMode = false,
}: {{componentName}}ViewProps) {
  const sectionStyle = {
    ...emphasisStyles[emphasis],
    border: '1px solid #cbd5e1',
    borderRadius: '1.25rem',
    display: 'grid',
    gap: '1rem',
    padding: '1.5rem',
  } satisfies CSSProperties;

  const headerStyle = {
    color: '#0f172a',
    display: 'flex',
    fontSize: '1.15rem',
    fontWeight: 700,
    justifyContent: 'space-between',
  } satisfies CSSProperties;

  const editModeStyle = {
    color: '#475569',
    fontSize: '0.875rem',
  } satisfies CSSProperties;

  const columnsStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
  } satisfies CSSProperties;

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <span>{title}</span>
        {editMode ? <span style={editModeStyle}>Layout</span> : null}
      </div>
      <div style={columnsStyle}>
        <div>{leftColumn}</div>
        <div>{rightColumn}</div>
      </div>
    </section>
  );
}
