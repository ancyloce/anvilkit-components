import { lazy, Suspense } from "react";
import {
	getDesignPreview,
	isDesignPreviewReference,
} from "./design-preview-store";

// Edit-mode-only wrapper, loaded via a dynamic import. `registerOverlayPortal`
// (used inside) pulls the Puck *editor* runtime (@puckeditor/core → @dnd-kit),
// which touches browser-only globals like `ResizeObserver` at module-eval time.
// Lazy-loading keeps that graph off the server / RSC render path and out of
// every non-editor consumer of this barrel — it's fetched client-side only when
// a block actually renders in edit mode.
const DesignBlockEditPortal = lazy(() =>
	import("./DesignBlockEditPortal").then((m) => ({
		default: m.DesignBlockEditPortal,
	})),
);

export type DesignBlockAspectRatio = "auto" | "16/9" | "4/3" | "1/1";

export interface DesignBlockProps {
	designId: string;
	previewUrl?: string;
	previewAssetId?: string;
	/** Set by the canvas plugin on overlay commit; the inspector renders a select when a host artboard catalog is registered, otherwise a text input. */
	artboardId?: string;
	alt?: string;
	aspectRatio?: DesignBlockAspectRatio;
	/** Empty-state text shown in edit mode when no preview exists. */
	editPromptText?: string;
	/** Empty-state text shown outside edit mode when no preview exists. */
	unavailableText?: string;
	/** Accessible label for the edit-mode open-in-canvas affordance. */
	editPortalLabel?: string;
}

export interface DesignBlockViewProps extends DesignBlockProps {
	editMode?: boolean;
	/** Puck node id (injected by Puck's render). Lets the edit-mode open affordance tell the plugin which block to patch on commit. */
	puckNodeId?: string;
}

const aspectRatioStyle: Record<DesignBlockAspectRatio, string | undefined> = {
	auto: undefined,
	"16/9": "16 / 9",
	"4/3": "4 / 3",
	"1/1": "1 / 1",
};

export function DesignBlock({
	designId,
	previewUrl,
	artboardId,
	alt = "Canvas design preview",
	aspectRatio = "auto",
	editPromptText = "Click to design this block in the canvas editor.",
	unavailableText = "Design not available.",
	editPortalLabel,
	editMode = false,
	puckNodeId,
}: DesignBlockViewProps) {
	const ratio = aspectRatioStyle[aspectRatio];

	// Preview resolution. New canvas commits write only a tiny `design://`
	// reference into the node props (the heavy image bytes live in the
	// plugin's object-URL store, off Puck's undo history); resolve that
	// reference — and the default empty-prop case — through the registered
	// store. A legacy/explicit `previewUrl` that is a real renderable URL
	// (an inlined data URL or an http asset) is honored as-is. The lookup is
	// synchronous: the commit's Puck `replace` re-renders this block, so the
	// freshly stored object URL is picked up without a subscription. On the
	// server (no store registered) it resolves to `null` → empty state.
	const resolvedPreview = isDesignPreviewReference(previewUrl)
		? getDesignPreview(designId, artboardId)
		: previewUrl && previewUrl.length > 0
			? previewUrl
			: getDesignPreview(designId, artboardId);

	const content = !resolvedPreview ? (
		<div
			data-testid="design-block-empty"
			data-design-id={designId}
			className="flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground"
			style={ratio ? { aspectRatio: ratio } : undefined}
		>
			{editMode ? editPromptText : unavailableText}
		</div>
	) : (
		<figure
			data-testid="design-block"
			data-design-id={designId}
			className="m-0 w-full"
			style={ratio ? { aspectRatio: ratio } : undefined}
		>
			<img
				src={resolvedPreview}
				alt={alt}
				className="block h-auto w-full rounded-lg border border-border object-cover"
				loading="lazy"
				decoding="async"
			/>
		</figure>
	);

	// Edit mode only: make the block open the canvas editor on click. The
	// portal opts the block out of Puck's interaction overlay so the click
	// lands. Render mode (RSC) returns the bare preview — no client code.
	if (editMode) {
		return (
			<Suspense fallback={content}>
				<DesignBlockEditPortal
					designId={designId}
					puckNodeId={puckNodeId ?? null}
					artboardId={artboardId ?? null}
					label={editPortalLabel}
				>
					{content}
				</DesignBlockEditPortal>
			</Suspense>
		);
	}

	return content;
}
