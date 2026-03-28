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
      ├── button
      └── input
```

Each folder in `src/*` is its own npm package. Every package is designed to work with Puck's `ComponentConfig` API and exports:

- a serializable props type
- a pure render component
- `fields`
- `defaultProps`
- `componentConfig`
- `metadata`

The current packages include:

- `src/button` -> `@anvilkit/button`
- `src/input` -> `@anvilkit/input`

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

From `packages/components`, run:

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
import {
  Button,
  componentConfig,
  type ButtonProps,
} from "@anvilkit/button";

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
