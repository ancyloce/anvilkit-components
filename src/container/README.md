# @anvilkit/container

A Puck-native single-slot container with maximum-width, padding, and logical
alignment controls.

```tsx
import { Container, componentConfig } from "@anvilkit/container";

export function Example() {
  return <Container content={<p>Nested content</p>} maxWidth="lg" />;
}

export const puckComponent = componentConfig;
```

The Puck config exposes `content` as a slot and stamps stable `root` and
`content` authoring targets. Start/end alignment uses logical margins, so the
component also behaves correctly in right-to-left layouts.
