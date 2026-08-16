// GENERATED FILE — DO NOT EDIT.
// Source: @anvilkit/ui `src/tabs.tsx`
// Generator: `scripts/derive-shadcn-fields.mjs` (manifest: `scripts/shadcn-field-targets.json`)
// Regenerate: `pnpm gen:fields` (from packages/extensions/components/)
//
// `<field>SourceValues` is the COMPLETE union as it exists upstream and is
// what `check:fields-drift` compares; `<field>Options` is the authorable
// subset after the DOC-01 curation recorded in the manifest's `exclude`.

/** Complete `variant` union from `tabs.tsx` (drift-tracked). */
export const listVariantSourceValues = ["default", "line"] as const;

/** Authorable options (no curation for this axis). */
export const listVariantOptions = ["default", "line"] as const;

export type ListVariant = (typeof listVariantOptions)[number];
