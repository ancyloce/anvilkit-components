import { lazy, Suspense } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";
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
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface DesignBlockViewProps extends DesignBlockProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025). Carried by the permanent wrapper §6.4
	 * requires — the content root is branch-dependent (empty state vs
	 * figure) and edit mode adds a portal, so a stable wrapper is the
	 * sanctioned fix.
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`canvas`). */
	targetAttrs?: Record<string, Record<string, string>>;
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

/** §2.2 merge: authored classes come AFTER base classes (no @anvilkit/ui dep → join). */
function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function DesignBlock({
	designId,
	previewUrl,
	artboardId,
	alt = "Canvas design preview",
	aspectRatio = "auto",
	editPromptText = "Click to design this block in the canvas editor.",
	unavailableText = "Design not available.",
	editPortalLabel,
	classNames,
	animation,
	editMode = false,
	puckNodeId,
	rootAttrs,
	targetAttrs,
}: DesignBlockViewProps) {
	const ratio = aspectRatioStyle[aspectRatio];
	const anim = animationAttrs(animation);
	// The root wrapper is the ONE element present in every branch, so it
	// carries the §2.4 entrance animation; `ratio` stays on the canvas
	// target where the aspect box actually lives.
	const rootClassName = mergeClassNames(
		"w-full",
		anim.className,
		classNames?.root,
	);

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
			{...targetAttrs?.canvas}
			data-testid="design-block-empty"
			data-design-id={designId}
			className={mergeClassNames(
				"flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground",
				classNames?.canvas,
			)}
			style={ratio ? { aspectRatio: ratio } : undefined}
		>
			{editMode ? editPromptText : unavailableText}
		</div>
	) : (
		<figure
			{...targetAttrs?.canvas}
			data-testid="design-block"
			data-design-id={designId}
			className={mergeClassNames("m-0 w-full", classNames?.canvas)}
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
			<div {...rootAttrs} className={rootClassName} style={anim.style}>
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
			</div>
		);
	}

	return (
		<div {...rootAttrs} className={rootClassName} style={anim.style}>
			{content}
		</div>
	);
}
