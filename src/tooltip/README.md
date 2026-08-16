# @anvilkit/tooltip

A Puck-native tooltip component scaffold generated for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/tooltip @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  Tooltip,
  componentConfig,
  defaultProps,
  type TooltipProps,
} from "@anvilkit/tooltip";

const config: Config<{
  Tooltip: TooltipProps;
}> = {
  components: {
    Tooltip: componentConfig,
  },
};

const data = {
  root: {},
  content: [
    {
      type: "Tooltip",
      props: {
        id: "tooltip-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <Tooltip title="Tooltip" body="<p>Start editing this block.</p>" />;
}
```

## Authoring surface (PLAN-0025 §6 / PLAN-0027)

`src/config.ts` declares `metadata.anvilkit.editor` (no `version` field — the
contract is structural) with a
`styleTargets` map. Every declared target id is stamped on a real element via
`anvilTargetAttrs(id, '<target>')` (the root uses `anvilRootAttrs(id)`), in
every render branch and in every mode — edit mode may change affordances, never
the target structure. Extend the map only together with the matching stamp and
the `tooltip.targets.<targetId>` label in all four catalogs.

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
