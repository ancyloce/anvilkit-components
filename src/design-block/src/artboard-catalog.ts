/**
 * Host-injected lookup of available artboards for a given `designId`.
 *
 * The Puck inspector cannot read the canvas IR directly (the canvas
 * editor is a sibling, not a child), so this registry is the bridge:
 * `plugin-canvas-studio` calls `setArtboardCatalog(fn)` from its
 * `onInit` hook and the DesignBlock's `resolveFields` consults the
 * registered function to populate the `artboardId` select.
 *
 * When no catalog is registered (e.g. `@anvilkit/design-block` is used
 * outside the canvas integration), the `artboardId` field falls back
 * to a plain text input so the component still works on its own.
 */
export interface ArtboardCatalogEntry {
	readonly id: string;
	readonly label?: string;
}

export type ArtboardCatalogFn = (
	designId: string,
) => ReadonlyArray<ArtboardCatalogEntry>;

let currentCatalog: ArtboardCatalogFn | null = null;

export function setArtboardCatalog(fn: ArtboardCatalogFn | null): void {
	currentCatalog = fn;
}

export function getArtboardCatalog(): ArtboardCatalogFn | null {
	return currentCatalog;
}

/**
 * Resolve artboards for a given design id, returning [] when no catalog
 * is registered, when the catalog throws, or when the catalog returns
 * a falsy / non-array value.
 */
export function listArtboards(
	designId: string,
): ReadonlyArray<ArtboardCatalogEntry> {
	const fn = currentCatalog;
	if (!fn) return [];
	if (!designId || designId.length === 0) return [];
	try {
		const result = fn(designId);
		return Array.isArray(result) ? result : [];
	} catch {
		return [];
	}
}
