# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A workspace of independently publishable **Puck-native React component packages**. Each package under `src/<slug>/` ships both a React component and a Puck `ComponentConfig` contract. Packages are installed individually (e.g. `@anvilkit/button`), never via an umbrella package.

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
pnpm lint && pnpm typecheck && pnpm build
```

## Component package contract

Every `src/<slug>/` must export from `src/index.ts`:

| Export | Type |
|---|---|
| `componentConfig` | `ComponentConfig` |
| `defaultProps` | serializable defaults |
| `fields` | `Fields<Props>` |
| `metadata` | `ComponentMetadata` |
| `<camel>Config`, `<camel>DefaultProps`, `<camel>Fields`, `<camel>Metadata` | convenience aliases |

`config.ts` must import `packageJson` and populate `metadata` from it (`componentName`, `componentSlug`, `packageName`, `packageVersion`, `scaffoldType`, `schemaVersion`). The `render` function must be a pure adapter built with `createElement(...)` and must pass `editMode` through.

## Naming conventions

- **Slug**: lowercase kebab-case (`button-group`)
- **Package name**: `@anvilkit/<slug>`
- **React symbol**: PascalCase (`ButtonGroup`)
- **Config alias**: lowerCamelCase + `Config` (`buttonGroupConfig`)

## Styling rules

`styles.css` must start with:
```css
@import "@anvilkit/tailwind-config/shadcn";
@source "./**/*.{ts,tsx}";
```

Add extra `@source` entries for any consumed `@anvilkit/ui` source files.

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

## Adding a component

1. Run `pnpm gen:component` — slug must be unique in `src/`, template must be `content`, `layout`, or `form`.
2. Fill in real behavior in `<ComponentName>.tsx` and finalize `defaultProps`, `fields`, metadata.
3. Wire `@anvilkit/ui` peer/dev deps and any needed CSS `@source` entries.
4. Validate: `pnpm lint && pnpm typecheck && pnpm build`.
5. Verify manually: mobile / tablet / desktop layouts, light / dark themes, `editMode` safety.

## Release

Use Changesets for all version bumps — do not hand-edit `package.json` versions. Add a changeset for every user-facing change before running `pnpm release`.
