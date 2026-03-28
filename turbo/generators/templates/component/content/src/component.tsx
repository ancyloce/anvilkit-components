import type { RichText } from '@puckeditor/core';

export interface {{componentName}}Props {
  title: string;
  body: RichText;
  alignment?: 'left' | 'center' | 'right';
}

export interface {{componentName}}ViewProps extends {{componentName}}Props {
  editMode?: boolean;
}

const alignmentClasses: Record<NonNullable<{{componentName}}Props['alignment']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function {{componentName}}({
  title,
  body,
  alignment = 'left',
}: {{componentName}}ViewProps) {
  return (
    <section
      className={`grid gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm ${alignmentClasses[alignment]}`}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-7 text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4">
        {body}
      </div>
    </section>
  );
}
