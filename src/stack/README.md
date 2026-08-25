# @anvilkit/stack

A Puck slot container for vertical or horizontal flex layouts.

```tsx
import { Stack, componentConfig } from "@anvilkit/stack";

export function Example() {
  return <Stack content={<p>Nested content</p>} gap="md" />;
}

export const puckComponent = componentConfig;
```

Direction, gap, alignment, justification, and wrapping are structured fields.
The config exposes stable `root` and `content` authoring targets.
