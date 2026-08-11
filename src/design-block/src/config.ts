import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { listArtboards } from "./artboard-catalog";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import type { DesignBlockProps } from "./DesignBlock";
import { DesignBlock } from "./DesignBlock";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type DesignBlockAuthorableProps = AuthorableProps<DesignBlockProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of DesignBlock.tsx.
 * Only two elements exist in EVERY branch: the permanent wrapper (`root`)
 * and the single content box (`canvas`) — the empty-state `<div>` and the
 * preview `<figure>` are the two branches of that one box, and the
 * edit-mode overlay portal wraps it without adding a stable element. The
 * preview `<img>` exists only when a preview resolves, so it is
 * deliberately NOT a target (a branch-conditional target would violate the
 * "stamped in all branches" rule and fail the defaultProps parity walk).
 * No §2.3 data source: design-block has no collection.
 */
const STYLE_TARGET_IDS = ["root", "canvas"] as const;

type DesignBlockTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "DesignBlock",
	componentSlug: "design-block",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "layout",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1. Allowlists stay
	// box-model/appearance ONLY: the design canvas is an arbitrary-content
	// surface with its own protocol, so granting broad CSS here is
	// explicitly prohibited ("never grant all CSS by default"). No
	// typography is granted on either target — text renders only in the
	// empty-state branch, so type grants would silently no-op once a
	// preview exists.
	// p6-003 widening stays as narrow as the original allowlist. `canvas`
	// gains `minHeight`/`maxHeight` (following its existing `height`
	// grant), `overflow` (clipping the preview to the radius it already
	// grants) and `filter`/`blendMode` — the media grants, because
	// `canvas` is the box the preview <img> renders inside. `root` is a
	// bare wrapper and gains sizing bounds only. No typography, no
	// flex/grid, no `zIndex`.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Design block",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"opacity",
						"minHeight",
						"maxHeight",
					],
				},
				canvas: {
					label: "Canvas",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"minHeight",
						"maxHeight",
						"overflow",
						"filter",
						"blendMode",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	designId: "",
	previewUrl: "",
	previewAssetId: "",
	artboardId: "",
	alt: "Canvas design preview",
	aspectRatio: "auto",
} satisfies DesignBlockProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<DesignBlockAuthorableProps> {
	return {
		...authoringFields,
		designId: {
			type: "text",
			label: t("design-block.fields.designId.label"),
		},
		previewUrl: {
			type: "text",
			label: t("design-block.fields.previewUrl.label"),
		},
		previewAssetId: {
			type: "text",
			label: t("design-block.fields.previewAssetId.label"),
		},
		artboardId: {
			type: "text",
			label: t("design-block.fields.artboardId.label"),
		},
		alt: {
			type: "text",
			label: t("design-block.fields.alt.label"),
		},
		aspectRatio: {
			type: "radio",
			label: t("design-block.fields.aspectRatio.label"),
			options: [
				{
					label: t("design-block.fields.aspectRatio.options.auto"),
					value: "auto",
				},
				{
					label: t("design-block.fields.aspectRatio.options.16-9"),
					value: "16/9",
				},
				{
					label: t("design-block.fields.aspectRatio.options.4-3"),
					value: "4/3",
				},
				{
					label: t("design-block.fields.aspectRatio.options.1-1"),
					value: "1/1",
				},
			],
		},
		animation: animationField({
			label: t("design-block.fields.animation.label"),
			preset: t("design-block.fields.animation.preset"),
			presetOptions: {
				none: t("design-block.fields.animation.preset.options.none"),
				"fade-in": t("design-block.fields.animation.preset.options.fade-in"),
				"slide-up": t("design-block.fields.animation.preset.options.slide-up"),
				"slide-down": t(
					"design-block.fields.animation.preset.options.slide-down",
				),
				"zoom-in": t("design-block.fields.animation.preset.options.zoom-in"),
			},
			duration: t("design-block.fields.animation.duration"),
			delay: t("design-block.fields.animation.delay"),
			easing: t("design-block.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`design-block.targets.${targetId}`),
			})),
			t("design-block.fields.classNames.label"),
		),
	};
}

const renderDesignBlock: ComponentConfig<DesignBlockAuthorableProps>["render"] =
	({
		designId,
		previewUrl,
		previewAssetId,
		artboardId,
		alt,
		aspectRatio,
		editPromptText,
		unavailableText,
		editPortalLabel,
		classNames,
		animation,
		editMode,
		// Puck injects the node id into render props (`WithId`); thread it
		// through so the edit-mode open affordance can name the block it opens.
		id,
	}) =>
		createElement(DesignBlock, {
			designId,
			previewUrl,
			previewAssetId,
			artboardId,
			alt,
			aspectRatio,
			editPromptText,
			unavailableText,
			editPortalLabel,
			classNames,
			animation,
			editMode,
			puckNodeId: id,
			// §6.2: stable targets in EVERY mode; the compiler owns CSS.
			rootAttrs: anvilRootAttrs(id),
			targetAttrs: {
				canvas: anvilTargetAttrs(id, "canvas"),
			} satisfies Record<
				Exclude<DesignBlockTargetId, "root">,
				Record<string, string>
			>,
		});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `design-block.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label. Under
 * the default (en) `t` each label resolves to the literal declared
 * above, so the static `componentConfig` export is unchanged.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`design-block.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<DesignBlockAuthorableProps> {
	const localizedFields = buildFields(t);

	/**
	 * Swap the `artboardId` field between a select (when a host catalog is
	 * available for the current designId) and a plain text input (when it
	 * is not). Keeps the public field name stable; only the inspector UX
	 * changes.
	 *
	 * The type is derived from Puck's `ComponentConfig<DesignBlockProps>["resolveFields"]`
	 * so a future Puck signature change surfaces here at typecheck time. The
	 * `params` arg is intentionally unused — this callback only consults
	 * `data.props.designId` and the module-singleton artboard catalog.
	 */
	const resolveDesignBlockFields: NonNullable<
		ComponentConfig<DesignBlockProps>["resolveFields"]
	> = (data, _params) => {
		const designId = data.props?.designId ?? "";
		const artboards = listArtboards(designId);
		if (artboards.length === 0) {
			return localizedFields;
		}
		const selectOptions = artboards.map((entry) => ({
			label: entry.label ?? entry.id,
			value: entry.id,
		}));
		return {
			...localizedFields,
			artboardId: {
				type: "select",
				label: t("design-block.fields.artboardId.selectLabel"),
				options: selectOptions,
			},
		};
	};

	return {
		label: t("design-block.label"),
		defaultProps: {
			...defaultProps,
			alt: t("design-block.a11y.previewAlt"),
			editPromptText: t("design-block.fallback.editPrompt"),
			unavailableText: t("design-block.fallback.unavailable"),
			editPortalLabel: t("design-block.a11y.editPortal"),
		},
		fields: localizedFields,
		metadata: buildMetadata(t),
		render: renderDesignBlock,
		resolveFields: resolveDesignBlockFields,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<DesignBlockAuthorableProps>;

export const designBlockConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<DesignBlockAuthorableProps>;

export const componentConfig = designBlockConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<DesignBlockAuthorableProps> {
	return buildConfig(createT(options));
}

export const createDesignBlockConfig = createComponentConfig;
