/**
 * @file Open-canvas intent contract between `DesignBlock` (the Puck
 * component, emitter) and `@anvilkit/plugin-canvas-studio` (the Studio
 * plugin, listener).
 *
 * The component and the plugin are already coupled by the `"DesignBlock"`
 * component-type name; this `window` CustomEvent keeps them decoupled at
 * the *import* level — the component never imports the plugin's mode
 * store. The plugin imports this constant (it already depends on
 * `@anvilkit/design-block` for the artboard catalog) so there is a single
 * source of truth for the event name.
 *
 * No React, no DOM refs — safe to import from both the client portal and
 * the plugin's (node/SSR) lifecycle code.
 */

/** `window` event the canvas-studio plugin listens for to open the editor. */
export const CANVAS_OPEN_EVENT = "anvilkit-canvas:open";

/** Payload carried on {@link CANVAS_OPEN_EVENT}. */
export interface OpenCanvasDetail {
	/**
	 * The block's design id. May be empty for a freshly inserted block —
	 * the listener allocates a fresh id in that case.
	 */
	readonly designId: string;
	/** The Puck node id of the block, so the plugin can patch its preview on commit. */
	readonly puckNodeId: string | null;
	/** Optional artboard id the overlay should open on. */
	readonly artboardId: string | null;
}

/**
 * Dispatch the open-canvas intent. No-op during SSR (no `window`); the
 * affordance only fires from a click inside the Puck editor, which is
 * always client-side.
 */
export function dispatchOpenCanvas(detail: OpenCanvasDetail): void {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent<OpenCanvasDetail>(CANVAS_OPEN_EVENT, { detail }),
	);
}
