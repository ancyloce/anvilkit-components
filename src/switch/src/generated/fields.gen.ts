// GENERATED FILE — DO NOT EDIT.
// Source: @anvilkit/ui `src/switch.tsx`
// Generator: `scripts/derive-shadcn-fields.mjs` (manifest: `scripts/shadcn-field-targets.json`)
// Regenerate: `pnpm gen:fields` (from packages/extensions/components/)
//
// `<field>SourceValues` is the COMPLETE union as it exists upstream and is
// what `check:fields-drift` compares; `<field>Options` is the authorable
// subset after the DOC-01 curation recorded in the manifest's `exclude`.

/** Complete `size` union from `switch.tsx` (drift-tracked). */
export const sizeSourceValues = ["sm", "default"] as const;

/** Authorable options (no curation for this axis). */
export const sizeOptions = ["sm", "default"] as const;

export type Size = (typeof sizeOptions)[number];
