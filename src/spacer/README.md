# @anvilkit/spacer

A silent, selectable Puck spacer with five spacing presets.

```tsx
import { Spacer, componentConfig } from "@anvilkit/spacer";

export function Example() {
  return <Spacer size="lg" />;
}

export const puckComponent = componentConfig;
```

The rendered spacer is hidden from assistive technology. Edit mode adds a
visual affordance without changing its DOM or stable `root` authoring target.
