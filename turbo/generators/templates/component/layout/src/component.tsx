import type { ReactNode } from 'react';
import type { Slot } from '@puckeditor/core';
import { type AnimationProps, animationAttrs } from './authoring';

export interface {{componentName}}Props {
  title: string;
  leftColumn: Slot;
  rightColumn: Slot;
  emphasis?: 'balanced' | 'accent';
  /** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
  classNames?: Record<string, string>;
  /** §2.4 entrance animation (PLAN-0027), applied to the root element. */
  animation?: AnimationProps;
}

export interface {{componentName}}ViewProps {
  title: string;
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  emphasis?: 'balanced' | 'accent';
  editMode?: boolean;
  classNames?: Record<string, string>;
  animation?: AnimationProps;
  /**
   * Stable §6.2 root-target attributes stamped by the config adapter
   * in EVERY mode (PLAN-0025).
   */
  rootAttrs?: Record<string, string>;
  /** Named-target attributes keyed by target id (`content`). */
  targetAttrs?: Record<string, Record<string, string>>;
}

const emphasisClasses: Record<NonNullable<{{componentName}}ViewProps['emphasis']>, string> = {
  balanced: 'border-border bg-gradient-to-b from-background to-muted/40',
  accent: 'border-primary/15 bg-gradient-to-b from-primary/5 via-accent/20 to-background',
};

/** §2.2 merge: authored classes come AFTER base classes (no @anvilkit/ui dep → join). */
function mergeClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export function {{componentName}}({
  title,
  leftColumn,
  rightColumn,
  emphasis = 'balanced',
  editMode = false,
  classNames,
  animation,
  rootAttrs,
  targetAttrs,
}: {{componentName}}ViewProps) {
  const anim = animationAttrs(animation);

  return (
    <section
      {...rootAttrs}
      className={mergeClassNames(
        'grid gap-4 rounded-3xl border p-6 shadow-sm',
        emphasisClasses[emphasis],
        anim.className,
        classNames?.root,
      )}
      style={anim.style}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-semibold text-foreground">{title}</span>
        {editMode ? (
          <span className="text-sm text-muted-foreground">Layout</span>
        ) : null}
      </div>
      <div
        {...targetAttrs?.content}
        className={mergeClassNames(
          'grid gap-4 md:grid-cols-2',
          classNames?.content,
        )}
      >
        <div className="min-w-0">{leftColumn}</div>
        <div className="min-w-0">{rightColumn}</div>
      </div>
    </section>
  );
}
