# @anvilkit/grid

A responsive Puck grid slot with one-to-four-column and auto-fit modes.

```tsx
import { Grid, componentConfig } from "@anvilkit/grid";

export function Example() {
  return <Grid content={<p>Nested content</p>} columns="3" gap="lg" />;
}

export const puckComponent = componentConfig;
```

Fixed modes collapse naturally at smaller breakpoints; auto mode uses a
minimum card width. The config exposes stable `root` and `content` targets.
