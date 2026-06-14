/**
 * Host-injected lookup of a DesignBlock's rendered preview, keyed by
 * `(designId, artboardId)`.
 *
 * The canvas integration exports a design to an image and, rather than baking
 * the heavy `data:image/...;base64,...` string into the Puck node props (which
 * Puck's undo history would then retain a full copy of on every edit — see the
 * repo performance report), keeps the bytes in a per-plugin-instance store and
 * writes only a tiny `design://<designId>` reference back into the node. This
 * registry is the bridge the DesignBlock render reads to turn that reference
 * back into a renderable `blob:` object URL.
 *
 * Mirrors {@link setArtboardCatalog}: `plugin-canvas-studio` calls
 * {@link setDesignPreviewSource} from its `onInit` hook (and clears it with
 * `null` on `onDestroy`); the DesignBlock consults {@link getDesignPreview}
 * during render. The lookup is a plain synchronous read — the canvas commit
 * dispatches a Puck `replace` that re-renders the block, so the freshly stored
 * preview is picked up without a subscription.
 *
 * When no source is registered (e.g. `@anvilkit/design-block` is used outside
 * the canvas integration), {@link getDesignPreview} returns `null` and the
 * block falls back to its `previewUrl` prop or the empty state.
 */
export interface DesignPreviewSource {
	/**
	 * Resolve the renderable preview URL for a design (optionally a specific
	 * artboard). Return `null` when nothing is cached for that id.
	 */
	get(designId: string, artboardId?: string): string | null;
}

let currentSource: DesignPreviewSource | null = null;

export function setDesignPreviewSource(
	source: DesignPreviewSource | null,
): void {
	currentSource = source;
}

export function getDesignPreviewSource(): DesignPreviewSource | null {
	return currentSource;
}

/**
 * Resolve the stored preview URL for a design, returning `null` when no source
 * is registered, when the source throws, or when nothing is cached for the id.
 */
export function getDesignPreview(
	designId: string,
	artboardId?: string,
): string | null {
	const source = currentSource;
	if (!source) return null;
	if (!designId || designId.length === 0) return null;
	try {
		const url = source.get(designId, artboardId);
		return typeof url === "string" && url.length > 0 ? url : null;
	} catch {
		return null;
	}
}

/** The `design://` URL scheme a DesignBlock node stores as its preview reference. */
export const DESIGN_PREVIEW_REFERENCE_PREFIX = "design://";

/**
 * True when a `previewUrl` prop is a `design://` store reference (resolve it via
 * {@link getDesignPreview}) rather than a directly renderable URL (a legacy
 * inlined data URL or an http(s) asset, which the block renders as-is).
 */
export function isDesignPreviewReference(
	previewUrl: string | undefined,
): boolean {
	return (
		typeof previewUrl === "string" &&
		previewUrl.startsWith(DESIGN_PREVIEW_REFERENCE_PREFIX)
	);
}
