# @anvilkit/icon

A dependency-free, current-color icon block for Puck with a curated glyph
set, size and stroke controls, and decorative or labelled accessibility modes.

```tsx
import { Icon, componentConfig } from "@anvilkit/icon";

export function Example() {
  return <Icon name="sparkles" size="lg" decorative />;
}

export const puckComponent = componentConfig;
```

Available glyphs are `sparkles`, `check`, `arrow-right`, `heart`,
`star`, and `circle`. The config exposes stable `root` and `icon`
authoring targets.
