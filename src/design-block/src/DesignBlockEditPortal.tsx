"use client";

import { registerOverlayPortal } from "@puckeditor/core";
import { type ReactNode, useEffect, useRef } from "react";
import { dispatchOpenCanvas, type OpenCanvasDetail } from "./open-canvas-event";

export interface DesignBlockEditPortalProps extends OpenCanvasDetail {
	children: ReactNode;
}

/**
 * Edit-mode wrapper that makes the whole DesignBlock open the canvas
 * editor on click.
 *
 * In the Puck editor every component sits under a transparent interaction
 * overlay that captures drag/select gestures — and swallows ordinary
 * clicks. `registerOverlayPortal(el)` (Puck's documented escape hatch,
 * https://puckeditor.com/docs/integrating-puck/overlay-portals) disables
 * that overlay while pointing at `el`, so the click reaches this handler.
 *
 * Per the whole-block affordance choice, the entire block is the portal:
 * clicking anywhere opens the canvas. The trade-off is that Puck's
 * click-to-select/drag no longer applies to the block body — the layer
 * tree and the canvas overlay remain the ways to manage it.
 *
 * Isolated in its own `"use client"` module (the package builds
 * bundleless, so this stays a discrete client component) and only
 * rendered when `editMode` is true, so the RSC render route never mounts
 * it and ships none of this client code.
 */
export function DesignBlockEditPortal({
	designId,
	puckNodeId,
	artboardId,
	children,
}: DesignBlockEditPortalProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// registerOverlayPortal returns a cleanup that re-enables the overlay.
		return registerOverlayPortal(el);
	}, []);

	const open = () => dispatchOpenCanvas({ designId, puckNodeId, artboardId });

	// A button-role div (not a <button>) because a <button> cannot legally
	// wrap the <figure>/<img> preview content.
	return (
		<div
			ref={ref}
			role="button"
			tabIndex={0}
			data-testid="design-block-open"
			aria-label="Open this design in the canvas editor"
			className="w-full cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
			onClick={open}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					open();
				}
			}}
		>
			{children}
		</div>
	);
}
