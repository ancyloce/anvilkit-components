// GENERATED FILE — DO NOT EDIT.
// Source: @anvilkit/ui `src/alert.tsx`
// Generator: `scripts/derive-shadcn-fields.mjs` (manifest: `scripts/shadcn-field-targets.json`)
// Regenerate: `pnpm gen:fields` (from packages/extensions/components/)
//
// `<field>SourceValues` is the COMPLETE union as it exists upstream and is
// what `check:fields-drift` compares; `<field>Options` is the authorable
// subset after the DOC-01 curation recorded in the manifest's `exclude`.

/** Complete `variant` union from `alert.tsx` (drift-tracked). */
export const variantSourceValues = ["default", "destructive"] as const;

/** Authorable options (no curation for this axis). */
export const variantOptions = ["default", "destructive"] as const;

export type Variant = (typeof variantOptions)[number];
