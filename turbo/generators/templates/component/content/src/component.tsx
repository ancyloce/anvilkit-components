import type { CSSProperties } from 'react';
import type { RichText } from '@puckeditor/core';

export interface {{componentName}}Props {
  title: string;
  body: RichText;
  alignment?: 'left' | 'center' | 'right';
}

export interface {{componentName}}ViewProps extends {{componentName}}Props {
  editMode?: boolean;
}

const alignmentStyles: Record<NonNullable<{{componentName}}Props['alignment']>, CSSProperties> = {
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
};

export function {{componentName}}({
  title,
  body,
  alignment = 'left',
}: {{componentName}}ViewProps) {
  const sectionStyle = {
    ...alignmentStyles[alignment],
    display: 'grid',
    gap: '0.75rem',
    padding: '1.5rem',
  } satisfies CSSProperties;

  const titleStyle = {
    color: '#0f172a',
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  } satisfies CSSProperties;

  const bodyStyle = {
    color: '#334155',
    fontSize: '1rem',
    lineHeight: 1.7,
  } satisfies CSSProperties;

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <div style={bodyStyle}>{body}</div>
    </section>
  );
}
