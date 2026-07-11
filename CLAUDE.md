# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A workspace of independently publishable **Puck-native React component packages**. Each package under `src/<slug>/` ships both a React component and a Puck `ComponentConfig` contract. Packages are installed individually (e.g. `@anvilkit/button`), never via an umbrella package.

## ⚠️ Never run `pnpm install` inside this directory standalone

This directory is a **git submodule** *and* a nested pnpm workspace whose
`pnpm-workspace.yaml` reaches out of the submodule into the superproject via
`../../` globs (`../../capabilities/analytics/*`, `../../tooling/configs/*`,
`../../runtime/ui`). Those same packages are **also** importers of the
repo-root `pnpm-lock.yaml`, so two resolvers cover one package set.

Running `pnpm install` here (i.e. `cd packages/extensions/components && pnpm
install`) regenerates the **nested** `pnpm-lock.yaml` and re-resolves
`@anvilkit/ui` (plus analytics/configs) into *this* workspace's
`node_modules`, clobbering the root install — the recorded **"components
install clobbers `ui` → duplicate React"** runtime failure (two React copies
→ invalid-hook / context-mismatch crashes).

**Always install from the monorepo root with the whole workspace.** No
pre-commit hook guards this — it is a discipline rule until the nested
workspace is dissolved by the planned components absorption (which removes the
nested `pnpm-workspace.yaml`, `pnpm-lock.yaml`, orphaned `.changeset/`, and the
local publish CI, folding publishing into the root `publish.yml`). If you must
build/test only these packages, use the root workspace filter
(`pnpm -C <repo-root> --filter "./packages/extensions/components/**" <script>`),
not a standalone install here.

## Commands

```bash
pnpm dev           # Watch all packages (Rslib)
pnpm build         # Build all packages
pnpm typecheck     # tsc --noEmit across all packages
pnpm lint          # Biome lint
pnpm format        # Biome format

# Scaffold a new component
pnpm gen:component
pnpm gen:component -- --name <slug> --label "Display Name" --template <content|layout|form> [--category <slug>]

# Versioning / publishing
pnpm changeset     # Create a changeset
pnpm release       # changeset version + build + changeset publish
```

**Validation before finishing any component work:**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

(`pnpm test` runs the workspace-level vitest suite in `tests/`, including the
i18n catalog/factory checks for every package.)

## Component package contract

Every `src/<slug>/` must export from `src/index.ts`:

| Export                                                                     | Type                  |
| -------------------------------------------------------------------------- | --------------------- |
| `componentConfig`                                                          | `ComponentConfig`     |
| `defaultProps`                                                             | serializable defaults |
| `fields`                                                                   | `Fields<Props>`       |
| `metadata`                                                                 | `ComponentMetadata`   |
| `<camel>Config`, `<camel>DefaultProps`, `<camel>Fields`, `<camel>Metadata` | convenience aliases   |
| `createComponentConfig(options?)`                                          | locale-aware config factory |
| `create<Pascal>Config`                                                     | convenience alias for the factory |
| `<camel>I18nEntry`                                                         | i18n registry entry (`{ namespace, en, loadMessages }`) |
| `<Pascal>MessageKey`                                                       | type — union of the package's catalog keys |

`config.ts` must import `packageJson` and populate `metadata` from it (`componentName`, `componentSlug`, `packageName`, `packageVersion`, `scaffoldType`, `schemaVersion`). The `render` function must be a pure adapter built with `createElement(...)` and must pass `editMode` through.

## i18n

Every package ships per-locale message catalogs and a config factory:

- **Catalogs**: `i18n/messages/{en,zh,ja,ko}.json` at the **package root**
  (outside `src/` — the bundleless rslib build keeps these imports external,
  same mechanism as the `../package.json` import). All four locales must have
  exactly the same key set (enforced by `tests/i18n.test.ts`).
- **Keys**: flat, slug-namespaced —
  `<slug>.label`, `<slug>.fields.<path>.label`,
  `<slug>.fields.<path>.options.<value>`, `<slug>.fields.<path>.itemSummary`
  (`{index}` placeholder), `<slug>.a11y.<name>`, `<slug>.fallback.<name>`.
- **Resolver**: `src/i18n.ts` (self-contained per package, no `@anvilkit/core`
  dependency). Per-key resolution order: `options.messages` override → locale
  pack → en baseline. Unknown locales fall back to en.
- **Factory**: `createComponentConfig({ locale?, messages? })` builds a
  translated `ComponentConfig`; the static `componentConfig` export stays the
  English default (`createComponentConfig()` deep-equals it).
- **Scope**: translate editor chrome only — field/option labels, item
  summaries, and aria/fallback JSX strings (exposed as optional serializable
  string props with English component defaults; the factory injects localized
  values into the returned config's `defaultProps`). `defaultProps` page
  content (headlines, sample copy) stays English.
- `<camel>I18nEntry` is structurally compatible with `@anvilkit/core`'s i18n
  `RegistryEntry` so hosts can merge component catalogs into the Studio
  message registry — without the package importing core.

## Naming conventions

- **Slug**: lowercase kebab-case (`button-group`)
- **Package name**: `@anvilkit/<slug>`
- **React symbol**: PascalCase (`ButtonGroup`)
- **Config alias**: lowerCamelCase + `Config` (`buttonGroupConfig`)

## Styling rules

`styles.css` must start with:

```css
@import "@anvilkit/tailwind-config/component";
@source "./**/*.{ts,tsx}";
```

Add extra `@source` entries for any consumed `@anvilkit/ui` source files.

**Import `/component`, never `/shadcn`.** `/component` is the preflight-free,
source-scoped entry: each package emits only the utilities IT uses plus
zero-specificity token defaults. `/shadcn` is the **app-level** sheet — it ships
preflight and workspace-wide `@source` scans, so importing it from a component
re-emits the entire workspace utility superset + preflight into every package
(~175 KB each, ~96% duplicated). A per-component `dist/styles.css` gzip budget in
`.size-limit.json` (12 KB) guards against this regression.

**Color priority (never hardcode hex/rgb/hsl):**

1. shadcn semantic tokens — `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, etc.
2. Tailwind utilities
3. Custom CSS variables only when nothing above suffices — must work in both themes

## Coding constraints

- **Props must be serializable** — no functions, refs, or class instances in `defaultProps` or field schemas.
- **`editMode`**: disable all interactions (links, buttons, inputs) when `editMode` is true.
- **Icons**: `lucide-react` only. Do not mix other general-purpose icon libraries.
- **UI primitives**: prefer `@anvilkit/ui` (`cn`, button, input, etc.) before writing new abstractions.
- **No CSS overrides for base components** — compose via props, slots, variants, and Tailwind classes instead.
- **Responsive**: every component must work on mobile, tablet, and desktop (mobile-first Tailwind breakpoints).
- **Themes**: every component must support both light and dark mode.
- **Do not alter public API silently** — `index.ts` exports, prop names/types, and package `exports` are a stable contract.
- **Comments must be concise and efficient** — directly state the core intent of functions/methods, avoiding redundant descriptions.

## Adding a component

1. Run `pnpm gen:component` — slug must be unique in `src/`, template must be `content`, `layout`, or `form`.
2. Fill in real behavior in `<ComponentName>.tsx` and finalize `defaultProps`, `fields`, metadata.
3. Wire `@anvilkit/ui` peer/dev deps and any needed CSS `@source` entries.
4. Validate: `pnpm lint && pnpm typecheck && pnpm build`.
5. Verify manually: mobile / tablet / desktop layouts, light / dark themes, `editMode` safety.

## Release

### Versioning policy

- Component packages live on the **`0.1.x` line, aligned with `@anvilkit/ui`** — set a package's `version` to match the current `@anvilkit/ui` version (the package they peer-depend on).
- **Increment by minor** for every release (`0.1.x → 0.2.0 → 0.3.0 …`). Do **not** cut a `1.0.0` — these stay in the `0.x` range while the API is pre-stable.
- The `@anvilkit/ui` **peer range must include the `ui` version that `@anvilkit/core` pins**. `@anvilkit/core` depends on `@anvilkit/ui` as an exact version (its `workspace:*` publishes as the pinned `ui` version), so a peer range like `^0.1.5` must keep covering it — otherwise consumers installing a component alongside `@anvilkit/core` hit an `ERESOLVE` peer conflict.

### How publishing actually works

This workspace is no longer a standalone changesets repo — the packages are governed by the **repo-root** workspace. (A nested `pnpm-workspace.yaml` and `pnpm-lock.yaml` do still exist in this directory — see the install rule at the top of this file — but the repo-root workspace is the authoritative resolver for day-to-day work; the nested files are a legacy dual-resolution seam scheduled for removal in the components absorption.) The release workflow (`.github/workflows/publish.yml`) **does not run `changeset version`**: on push to `main` it compares every public `package.json` version against npm (`scripts/ensure-npm-packages-exist.mjs`) and publishes any version that is absent. So a release is driven by **editing the `version` field in `package.json` directly** — that is the intended mechanism, not a changeset.

> ⚠️ A local `.changeset/` still exists here but is **orphaned**: `changeset` resolves to the repo-root `.changeset/`, so changesets added in this submodule are never read and `pnpm release` here will not behave as documented in older notes. Bump versions by editing `package.json`.
