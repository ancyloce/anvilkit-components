import type { ReactNode } from 'react';
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

const emphasisClasses: Record<NonNullable<{{componentName}}ViewProps['emphasis']>, string> = {
  balanced: 'border-border bg-gradient-to-b from-background to-muted/40',
  accent: 'border-primary/15 bg-gradient-to-b from-primary/5 via-accent/20 to-background',
};

export function {{componentName}}({
  title,
  leftColumn,
  rightColumn,
  emphasis = 'balanced',
  editMode = false,
}: {{componentName}}ViewProps) {
  return (
    <section
      className={`grid gap-4 rounded-3xl border p-6 shadow-sm ${emphasisClasses[emphasis]}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-semibold text-foreground">{title}</span>
        {editMode ? (
          <span className="text-sm text-muted-foreground">Layout</span>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="min-w-0">{leftColumn}</div>
        <div className="min-w-0">{rightColumn}</div>
      </div>
    </section>
  );
}
