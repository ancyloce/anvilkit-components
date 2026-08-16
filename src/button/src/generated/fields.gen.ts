// GENERATED FILE — DO NOT EDIT.
// Source: @anvilkit/ui `src/button.tsx`
// Generator: `scripts/derive-shadcn-fields.mjs` (manifest: `scripts/shadcn-field-targets.json`)
// Regenerate: `pnpm gen:fields` (from packages/extensions/components/)
//
// `<field>SourceValues` is the COMPLETE union as it exists upstream and is
// what `check:fields-drift` compares; `<field>Options` is the authorable
// subset after the DOC-01 curation recorded in the manifest's `exclude`.

/** Complete `variant` union from `button.tsx` (drift-tracked). */
export const variantSourceValues = [
	"default",
	"outline",
	"secondary",
	"ghost",
	"destructive",
	"link",
] as const;

/** Authorable options (no curation for this axis). */
export const variantOptions = [
	"default",
	"outline",
	"secondary",
	"ghost",
	"destructive",
	"link",
] as const;

export type Variant = (typeof variantOptions)[number];

/** Complete `size` union from `button.tsx` (drift-tracked). */
export const sizeSourceValues = [
	"default",
	"xs",
	"sm",
	"lg",
	"icon",
	"icon-xs",
	"icon-sm",
	"icon-lg",
] as const;

/** Authorable subset — curated out: `icon`, `icon-xs`, `icon-sm`, `icon-lg`. */
export const sizeOptions = ["default", "xs", "sm", "lg"] as const;

export type Size = (typeof sizeOptions)[number];
