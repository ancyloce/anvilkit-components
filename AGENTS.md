# AGENTS.md

## Purpose of this repository
- Treat this monorepo as a **workspace of independently publishable Puck-native React component packages**.
- Every package under `src/<slug>` is intended to be installed directly (for example `@anvilkit/button`, `@anvilkit/input`, `@anvilkit/navbar`), not through an umbrella package.
- “Puck-native” here means each package ships a component plus a Puck `ComponentConfig` contract with serializable defaults and field definitions.

## Workspace architecture
- Package manager: **pnpm** (`packageManager` pinned in root `package.json`).
- Workspace members are declared in `pnpm-workspace.yaml`:
  - `src/*` (component packages in this repo)
  - `../configs/*` (shared config packages)
  - `../ui` (`@anvilkit/ui` primitives used by some components)
- Root tooling and scripts (`package.json`):
  - `pnpm dev` → watch all packages
  - `pnpm build` → build all packages with Rslib
  - `pnpm typecheck` → `tsc --noEmit` in all packages
  - `pnpm lint` / `pnpm format` → Biome
  - `pnpm gen:component` → Turbo generator wrapper
  - `pnpm changeset` / `pnpm release` → Changesets version + publish flow
- TypeScript baseline extends `@anvilkit/typescript-config/react-library.json` from root `tsconfig.json`.
- Formatting/linting is Biome (`biome.json`), with Tailwind directives enabled in CSS parser.

## Required shape of each component package (`src/<slug>`)
Keep package structure aligned with existing packages and generator templates:

- `src/<slug>/package.json`
- `src/<slug>/README.md`
- `src/<slug>/rslib.config.ts`
- `src/<slug>/tsconfig.json`
- `src/<slug>/src/<ComponentName>.tsx`
- `src/<slug>/src/config.ts`
- `src/<slug>/src/index.ts`
- `src/<slug>/src/styles.css`
- `src/<slug>/src/styles.d.ts`

### Naming conventions (follow generator logic)
- **Slug**: lowercase kebab-case npm-safe (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), used as folder and package suffix.
- **Package name**: `@anvilkit/<slug>`.
- **React symbol**: PascalCase from slug (`button-group` → `ButtonGroup`).
- **Config alias**: lowerCamelCase + `Config` (`button-group` → `buttonGroupConfig`).
- **Display label**: title-cased slug unless explicitly overridden.

### Export contract (do not break casually)
From `src/<slug>/src/index.ts`, export:
- CSS side-effect import (`import "./styles.css";`)
- component symbol (`Button`, `Input`, etc.)
- component prop types (including `*Props`, usually `*ViewProps`)
- canonical config exports:
  - `componentConfig`
  - `defaultProps`
  - `fields`
  - `metadata`
- convenience aliases:
  - `<camel>Config`
  - `<camel>DefaultProps`
  - `<camel>Fields`
  - `<camel>Metadata`

### `config.ts` expectations
- Import `packageJson` from `../package.json` and set metadata fields from it.
- Define and export:
  - `metadata` (`ComponentMetadata`) with at least:
    - `componentName`, `componentSlug`, `packageName`, `packageVersion`, `scaffoldType`, `schemaVersion`
    - optional `suggestedCategory`
  - `defaultProps` satisfying `<ComponentName>Props`
  - `fields` satisfying `Fields<<ComponentName>Props>`
  - `<camel>Config` satisfying `ComponentConfig<<ComponentName>Props>`
  - `componentConfig = <camel>Config`
- Build `render` as a pure adapter using `createElement(...)` and pass `editMode` through.

## Coding rules for agents in this repo
- **Start from existing package patterns** (`src/navbar`, `src/button`, `src/input`) before inventing abstractions.
- **Keep props serializable** in `defaultProps` and field schemas.
- **Keep render components pure**; no side effects, no data fetching, no hidden state coupling.
- **Do not silently alter public package surface** (`index.ts` exports, package `exports`, prop names/types).
- **Preserve edit-mode behavior**:
  - components should handle `editMode` and disable interactions (links/buttons/inputs) appropriately.
- **Prefer `@anvilkit/ui` primitives/utilities** where similar behavior already exists (for example `@anvilkit/ui/button`, `@anvilkit/ui/input`, `cn`).
- Match current TS/React style:
  - named exports
  - `satisfies` for typed config objects
  - small helper functions for variant mapping and behavior

## Styling rules
- Each package owns `src/styles.css` and imports it from `src/index.ts`.
- Start styles with:
  - `@import "@anvilkit/tailwind-config/shadcn";`
  - `@source "./**/*.{ts,tsx}";`
- Add extra `@source` entries for consumed `@anvilkit/ui` source files when component classes rely on those primitives (see `src/button/src/styles.css`, `src/input/src/styles.css`, `src/navbar/src/styles.css`).
- Prefer Tailwind utility classes and existing UI components over custom CSS expansions.

## Adding a new component package
1. Use the generator; do not scaffold manually unless fixing generator output:
   - interactive: `pnpm gen:component`
   - flags: `pnpm gen:component -- --name <slug> --template <content|layout|form> [--label "..."] [--category <slug>]`
2. Respect generator constraints:
   - slug must be lowercase kebab-case and unique in `src/`
   - template must be one of `content`, `layout`, `form`
3. After generation, fill in real component behavior:
   - update `<ComponentName>.tsx` markup/logic
   - finalize `defaultProps`, `fields`, metadata category, labels
   - wire any needed `@anvilkit/ui` peer/dev dependencies and CSS `@source`s
4. Keep generated file layout and export names intact.

## Validation checklist before finishing
Run from repository root:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Then manually verify:
- modified package `src/index.ts` still exports canonical + alias API
- `config.ts` still satisfies `ComponentConfig`/`Fields`/`ComponentMetadata`
- package `README.md` usage examples still match actual exports/props
- if package behavior changed, ensure interactions in `editMode` remain safe/non-interactive

## Release and versioning notes
- Versioning/publishing is Changesets-driven with independent package releases.
- Add a changeset (`pnpm changeset`) for user-facing changes in published packages.
- Root release command is `pnpm release` (`changeset version && pnpm build && changeset publish`).
- Do not hand-edit versions as a substitute for proper changesets in normal workflow.

## Do / Don’t
### Do
- Do treat each `src/<slug>` as a publishable package boundary.
- Do preserve canonical exports: `componentConfig`, `defaultProps`, `fields`, `metadata`.
- Do use the generator conventions as the source of truth for naming and file layout.
- Do keep `metadata` aligned with `package.json` name/version.

### Don’t
- Don’t introduce non-serializable props into config defaults/fields.
- Don’t remove alias exports unless a deliberate breaking-change plan exists.
- Don’t bypass `editMode` safeguards for clickable/form controls.
- Don’t add workspace-wide tooling changes when only package-level edits are required.
