# Changelog

## 0.3.0 - 2026-08-14

### Features

- Additive `preset: "marketing" | "system"` discriminator (PRD 0022
  FR-002). Default `"marketing"` keeps the existing pill render
  byte-identical; `"system"` renders pure shadcn `buttonVariants` with the
  full 6-value `variant` and 4-value `size` unions (hand-written literals;
  codegen arrives with FR-003). New `size` prop/field, honored only under
  the `"system"` preset; `variant` field widened to a 7-option select.

## 0.0.2 - 2026-04-03

_Release tag: `v0.0.2`_

_Compared to: `v0.0.1`_

### Chores

- publish components v0.0.1 (release) (790a2bd)

### Other

- 📝 docs(README): add styles import instructions for multiple components (b84cadd)
- 📦 chore(package.json): add styles.css entry and update sideEffects for multiple components (47b8d1e)

## 0.0.1 - 2026-04-01

_Release tag: `v0.0.1`_

### Features

- add components workspace with biome (bad4efa)

### Other

- 📦 chore(package.json): update version numbers for all components to 0.0.1 and streamline packageManager entry (a32b8a5)
- ✨ feat(components): integrate Tailwind CSS and update component styles (a11fa3a)
- 🩹 fix: update component imports and format script in package.json (02fbbac)
