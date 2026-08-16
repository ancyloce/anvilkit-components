import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
	Slot,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { TooltipProps, TooltipSide } from "./Tooltip";
import { Tooltip } from "./Tooltip";

/** Authorable shape: business props + the trigger slot + the §5.1 carriers. */
export type TooltipAuthorableProps = AuthorableProps<
	TooltipProps & { trigger: Slot }
>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Tooltip.tsx.
 * DOC-01 §5.15 left `root` conditional on the render introducing a
 * trigger wrapper — it does: the wrapper renders its own `<span>`
 * trigger, which is real DOM in every mode. The popup is deliberately
 * NOT a target: it is portal'd out of the component subtree (§3.9) and
 * never renders at all in the canvas.
 */
const STYLE_TARGET_IDS = ["root"] as const;

/** Physical sides only (DOC-01 §5.15 curation). */
const SIDE_VALUES: readonly TooltipSide[] = ["top", "right", "bottom", "left"];

export const metadata = {
	componentName: "Tooltip",
	componentSlug: "tooltip",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "display",
	// `root` is the inline trigger wrapper holding the slot content, so it
	// carries box vocabulary plus the typography that cascades into the
	// slot. `zIndex` is withheld: this target IS the component root, so
	// its stacking would escape into the page (ADR 0007 decision 5).
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Tooltip",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"cursor",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	content: "More info",
	side: "top",
	trigger: [],
} satisfies TooltipProps & { trigger: Slot };

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<TooltipAuthorableProps> {
	return {
		...authoringFields,
		content: {
			type: "text",
			label: t("tooltip.fields.content.label"),
		},
		// Hand-declared, deliberately outside `check:fields-drift`: `side` is
		// a base-ui positional prop, not a vendored cva/literal union
		// (DOC-01 §5.15).
		side: {
			type: "select",
			label: t("tooltip.fields.side.label"),
			options: SIDE_VALUES.map((value) => ({
				label: t(`tooltip.fields.side.options.${value}`),
				value,
			})),
		},
		// Slots are the only nesting mechanism (design 0022 §3.3); `allow`
		// stays unset so the full component whitelist can drop in.
		trigger: {
			type: "slot",
			label: t("tooltip.fields.trigger.label"),
		},
		animation: animationField({
			label: t("tooltip.fields.animation.label"),
			preset: t("tooltip.fields.animation.preset"),
			presetOptions: {
				none: t("tooltip.fields.animation.preset.options.none"),
				"fade-in": t("tooltip.fields.animation.preset.options.fade-in"),
				"slide-up": t("tooltip.fields.animation.preset.options.slide-up"),
				"slide-down": t("tooltip.fields.animation.preset.options.slide-down"),
				"zoom-in": t("tooltip.fields.animation.preset.options.zoom-in"),
			},
			duration: t("tooltip.fields.animation.duration"),
			delay: t("tooltip.fields.animation.delay"),
			easing: t("tooltip.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`tooltip.targets.${targetId}`),
			})),
			t("tooltip.fields.classNames.label"),
		),
	};
}

const renderTooltip: ComponentConfig<TooltipAuthorableProps>["render"] = ({
	id,
	content,
	side,
	trigger: Trigger,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Tooltip, {
		content,
		side,
		trigger: createElement(Trigger),
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `tooltip.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`tooltip.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<TooltipAuthorableProps> {
	return {
		label: t("tooltip.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderTooltip,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<TooltipAuthorableProps>;

export const tooltipConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<TooltipAuthorableProps>;

export const componentConfig = tooltipConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<TooltipAuthorableProps> {
	return buildConfig(createT(options));
}

export const createTooltipConfig = createComponentConfig;
