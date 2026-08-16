import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
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
import type { BadgeProps } from "./Badge";
import { Badge } from "./Badge";
import { variantOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type BadgeAuthorableProps = AuthorableProps<BadgeProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Badge.tsx: the
 * component renders exactly one `@anvilkit/ui` span carrying `label` as a
 * bare text child. There is no inner element to stamp, so `root` is the
 * whole map — wrapping the label purely to gain a second target would
 * fabricate DOM the component does not have (§8.5).
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Badge",
	componentSlug: "badge",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "display",
	// The single `root` element is an inline-flex, text-bearing span, so
	// the grantable §6.1 box + typography vocabulary is CSS-sane on it
	// (gap/alignItems/justifyContent act on the flex box `badgeVariants`
	// establishes; typography acts on the label text). `cursor` is
	// withheld — unlike Button this target is not interactive; `zIndex`
	// is withheld because this target IS the component root, so its
	// stacking would escape into the page (ADR 0007 decision 5).
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Badge",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"minHeight",
						"maxHeight",
						"margin",
						"padding",
						"gap",
						"rowGap",
						"columnGap",
						"alignItems",
						"justifyContent",
						"direction",
						"wrap",
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
						"inset",
						"overflow",
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
			},
			inlineText: [{ id: "label", propPath: "label", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	label: "Badge",
	variant: "default",
} satisfies BadgeProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<BadgeAuthorableProps> {
	return {
		...authoringFields,
		label: {
			type: "text",
			label: t("badge.fields.label.label"),
		},
		// Exact cva union from `@anvilkit/ui` `badgeVariants` (DOC-01 §5.2),
		// codegen output guarded by `check:fields-drift` (FR-003).
		variant: {
			type: "select",
			label: t("badge.fields.variant.label"),
			options: variantOptions.map((value) => ({
				label: t(`badge.fields.variant.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("badge.fields.animation.label"),
			preset: t("badge.fields.animation.preset"),
			presetOptions: {
				none: t("badge.fields.animation.preset.options.none"),
				"fade-in": t("badge.fields.animation.preset.options.fade-in"),
				"slide-up": t("badge.fields.animation.preset.options.slide-up"),
				"slide-down": t("badge.fields.animation.preset.options.slide-down"),
				"zoom-in": t("badge.fields.animation.preset.options.zoom-in"),
			},
			duration: t("badge.fields.animation.duration"),
			delay: t("badge.fields.animation.delay"),
			easing: t("badge.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`badge.targets.${targetId}`),
			})),
			t("badge.fields.classNames.label"),
		),
	};
}

const renderBadge: ComponentConfig<BadgeAuthorableProps>["render"] = ({
	id,
	label,
	variant,
	classNames,
	animation,
}) =>
	createElement(Badge, {
		label,
		variant,
		classNames,
		animation,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `badge.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`badge.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<BadgeAuthorableProps> {
	return {
		label: t("badge.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderBadge,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<BadgeAuthorableProps>;

export const badgeConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BadgeAuthorableProps>;

export const componentConfig = badgeConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BadgeAuthorableProps> {
	return buildConfig(createT(options));
}

export const createBadgeConfig = createComponentConfig;
