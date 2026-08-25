# @anvilkit/list

A Puck-native ordered or unordered list whose items are managed with Puck's
array field.

## Install

```sh
pnpm add @anvilkit/list @puckeditor/core
```

## Usage

```tsx
import { List, componentConfig } from "@anvilkit/list";

export function Example() {
  return (
    <List
      items={[{ text: "First item" }, { text: "Second item" }]}
      style="ordered"
      spacing="comfortable"
    />
  );
}

export const puckComponent = componentConfig;
```

The Puck config exposes item rows, list style, spacing, localized labels, and
stable `root` and repeated `item` authoring targets. Array item copy is not
declared as inline text because it has no stable top-level prop path.
