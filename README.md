# anvilkit-components

`anvilkit-components` is a pnpm workspace for independently publishable Puck-native React component packages built with Rslib.

## Workspace Layout

```text
.
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── turbo
│   └── generators
│       ├── config.ts
│       └── templates
└── src
      ├── accordion
      ├── alert
      ├── avatar
      ├── badge
      ├── bento-grid
      ├── blockquote
      ├── blog-list
      ├── button
      ├── card
      ├── checkbox
      ├── code
      ├── columns
      ├── container
      ├── design-block
      ├── grid
      ├── heading
      ├── helps
      ├── hero
      ├── icon
      ├── image
      ├── input
      ├── label
      ├── link
      ├── list
      ├── logo-clouds
      ├── navbar
      ├── pricing-minimal
      ├── progress
      ├── rich-text
      ├── section
      ├── select
      ├── separator
      ├── slider
      ├── spacer
      ├── stack
      ├── statistics
      ├── switch
      ├── table
      ├── tabs
      ├── text
      ├── textarea
      ├── tooltip
      └── video
```

Each folder in `src/*` is its own npm package. Every package is designed to work with Puck's `ComponentConfig` API and exports:

- a serializable props type
- a pure render component
- `fields`
- `defaultProps`
- `componentConfig`
- `metadata`

The current packages include:

- `src/accordion` -> `@anvilkit/accordion`
- `src/alert` -> `@anvilkit/alert`
- `src/avatar` -> `@anvilkit/avatar`
- `src/badge` -> `@anvilkit/badge`
- `src/bento-grid` -> `@anvilkit/bento-grid`
- `src/blockquote` -> `@anvilkit/blockquote`
- `src/blog-list` -> `@anvilkit/blog-list`
- `src/button` -> `@anvilkit/button`
- `src/card` -> `@anvilkit/card`
- `src/checkbox` -> `@anvilkit/checkbox`
- `src/code` -> `@anvilkit/code`
- `src/columns` -> `@anvilkit/columns`
- `src/container` -> `@anvilkit/container`
- `src/design-block` -> `@anvilkit/design-block`
- `src/grid` -> `@anvilkit/grid`
- `src/heading` -> `@anvilkit/heading`
- `src/helps` -> `@anvilkit/helps`
- `src/hero` -> `@anvilkit/hero`
- `src/icon` -> `@anvilkit/icon`
- `src/image` -> `@anvilkit/image`
- `src/input` -> `@anvilkit/input`
- `src/label` -> `@anvilkit/label`
- `src/link` -> `@anvilkit/link`
- `src/list` -> `@anvilkit/list`
- `src/logo-clouds` -> `@anvilkit/logo-clouds`
- `src/navbar` -> `@anvilkit/navbar`
- `src/pricing-minimal` -> `@anvilkit/pricing-minimal`
- `src/progress` -> `@anvilkit/progress`
- `src/rich-text` -> `@anvilkit/rich-text`
- `src/section` -> `@anvilkit/section`
- `src/select` -> `@anvilkit/select`
- `src/separator` -> `@anvilkit/separator`
- `src/slider` -> `@anvilkit/slider`
- `src/spacer` -> `@anvilkit/spacer`
- `src/stack` -> `@anvilkit/stack`
- `src/statistics` -> `@anvilkit/statistics`
- `src/switch` -> `@anvilkit/switch`
- `src/table` -> `@anvilkit/table`
- `src/tabs` -> `@anvilkit/tabs`
- `src/text` -> `@anvilkit/text`
- `src/textarea` -> `@anvilkit/textarea`
- `src/tooltip` -> `@anvilkit/tooltip`
- `src/video` -> `@anvilkit/video`

## Local Development

Install workspace dependencies:

```sh
pnpm install
```

Run all packages in watch mode:

```sh
pnpm dev
```

Build every package:

```sh
pnpm build
```

Run TypeScript checks for every package:

```sh
pnpm typecheck
```

## Add A New Component Package

From `packages/extensions/components`, run:

```sh
pnpm gen:component
```

The generator will prompt for:

- a lowercase component slug like `input` or `button-group`
- a display label
- a scaffold type: `content`, `layout`, or `form`
- an optional suggested category for metadata

Each scaffold creates a Puck-ready package with:

- `package.json`
- `README.md`
- `rslib.config.ts`
- `tsconfig.json`
- a render component
- a config module exporting `fields`, `defaultProps`, `componentConfig`, and metadata
- `index.ts` re-exporting the public package surface

For non-interactive usage, the legacy slug-only command still works and defaults to the `content` scaffold:

```sh
pnpm gen:component -- --args badge
```

Named flags are also supported:

```sh
pnpm gen:component -- --name hero-banner --label "Hero Banner" --template content --category marketing
```

The generated package name will be `@anvilkit/<name>`, and the exported React symbol will be derived in PascalCase. For example, `button-group` becomes `ButtonGroup`.

## Independent Publishing

Packages are versioned independently with Changesets. This repository does not use fixed or linked package groups, so only the packages that change receive version bumps.

Create a changeset while working on a package:

```sh
pnpm changeset
```

When you are ready to release from the repository root:

```sh
pnpm release
```

`pnpm release` will:

1. consume pending changesets
2. version changed packages
3. create the release commit via Changesets
4. build all component packages
5. publish unpublished package versions to npm

After a real publish, push the release commit and tags:

```sh
git push --follow-tags
```

## Package Usage

Each component package is consumed directly from npm after publish. Consumers compose their own Puck config from per-package exports:

```tsx
import type { Config } from "@puckeditor/core";
import { Button, componentConfig, type ButtonProps } from "@anvilkit/button";

const config: Config<{
  Button: ButtonProps;
}> = {
  components: {
    Button: componentConfig,
  },
};
```

Consumers do not install a single umbrella library. They install only the packages they need and compose them into a root Puck `Config`.

The package-specific aliases like `buttonConfig` and `buttonDefaultProps` are still exported for convenience, but the canonical contract for every package is `componentConfig`, `defaultProps`, `fields`, and `metadata`.
