# @anvilkit/blockquote

A semantic Puck blockquote with editable quote and citation fields.

## Install

```sh
pnpm add @anvilkit/blockquote @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  Blockquote,
  componentConfig,
  type BlockquoteProps,
} from "@anvilkit/blockquote";

const config: Config<{ Blockquote: BlockquoteProps }> = {
  components: { Blockquote: componentConfig },
};

export function Example() {
  return (
    <Blockquote
      quote="Good tools make ambitious ideas easier to express."
      citation="The AnvilKit team"
    />
  );
}
```

The Puck config exposes plain-text fields, localized authoring labels, stable
`root`, `quote`, and `citation` style targets, bindings, interactions,
per-target classes, and entrance animation settings.
