import type { RichText } from '@puckeditor/core';
import { type AnimationProps, animationAttrs } from './authoring';

export interface {{componentName}}Props {
  title: string;
  body: RichText;
  alignment?: 'left' | 'center' | 'right';
  /** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
  classNames?: Record<string, string>;
  /** §2.4 entrance animation (PLAN-0027), applied to the root element. */
  animation?: AnimationProps;
}

export interface {{componentName}}ViewProps extends {{componentName}}Props {
  editMode?: boolean;
  /**
   * Stable §6.2 root-target attributes stamped by the config adapter
   * in EVERY mode (PLAN-0025).
   */
  rootAttrs?: Record<string, string>;
  /** Named-target attributes keyed by target id (`title`, `body`). */
  targetAttrs?: Record<string, Record<string, string>>;
}

const alignmentClasses: Record<NonNullable<{{componentName}}Props['alignment']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/** §2.2 merge: authored classes come AFTER base classes (no @anvilkit/ui dep → join). */
function mergeClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export function {{componentName}}({
  title,
  body,
  alignment = 'left',
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
        'grid gap-4 rounded-2xl border border-border p-6 shadow-sm',
        alignmentClasses[alignment],
        anim.className,
        classNames?.root,
      )}
      style={anim.style}
    >
      <h2
        {...targetAttrs?.title}
        className={mergeClassNames(
          'text-2xl font-semibold tracking-tight text-foreground',
          classNames?.title,
        )}
      >
        {title}
      </h2>
      <div
        {...targetAttrs?.body}
        className={mergeClassNames(
          'space-y-4 text-base leading-7 text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
          classNames?.body,
        )}
      >
        {body}
      </div>
    </section>
  );
}
