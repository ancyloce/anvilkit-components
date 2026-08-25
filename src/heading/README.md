# @anvilkit/heading

A semantic, responsive Puck-native heading with selectable `h1`–`h6` levels.

## Install

```sh
pnpm add @anvilkit/heading @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  Heading,
  componentConfig,
  defaultProps,
  type HeadingProps,
} from "@anvilkit/heading";

const config: Config<{
  Heading: HeadingProps;
}> = {
  components: {
    Heading: componentConfig,
  },
};

const data = {
  root: {},
  content: [
    {
      type: "Heading",
      props: {
        id: "heading-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <Heading text="Build something remarkable" level="h1" />;
}
```

## Authoring surface (PLAN-0025 §6 / PLAN-0027)

`src/config.ts` declares `metadata.anvilkit.editor` (no `version` field — the
contract is structural) with a
`styleTargets` map. Every declared target id is stamped on a real element via
`anvilTargetAttrs(id, '<target>')` (the root uses `anvilRootAttrs(id)`), in
every render branch and in every mode — edit mode may change affordances, never
the target structure. Extend the map only together with the matching stamp and
the `heading.targets.<targetId>` label in all four catalogs.

Two authored props ride the same targets:

- `classNames?: Record<string, string>` — Tailwind passthrough per target id,
  merged **after** the base classes so authored classes win. A class only takes
  effect if the host page's compiled CSS contains it.
- `animation?: { preset, durationMs?, delayMs?, easing? }` — entrance preset
  applied to the root through `animationAttrs()`; the keyframes live in
  `src/styles.css` behind `@media (prefers-reduced-motion: no-preference)`.

Neither is stamped into `defaultProps`. The hidden `appearance`/`interactions`/
`bindings` carriers come from `...authoringFields`; `src/authoring.ts` is a
verbatim per-package copy locked by the workspace `authoring-contract` suite.
