import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { AlertProps } from "./Alert";
import { Alert } from "./Alert";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import { variantOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type AlertAuthorableProps = AuthorableProps<AlertProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Alert.tsx:
 * the cva `root` container, the `title`, and the `description`. The
 * description is conditional on its prop — the same allowance the `card`
 * package's title/description carry — and is present under defaults.
 */
const STYLE_TARGET_IDS = ["root", "title", "description"] as const;

type AlertTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Alert",
	componentSlug: "alert",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "display",
	// `root` is the bordered grid container (box vocabulary + the
	// typography that cascades to both text parts); `title` and
	// `description` are text-bearing and carry their own typography.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Alert",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"margin",
						"padding",
						"gap",
						"rowGap",
						"columnGap",
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
						"lineHeight",
						"textAlign",
					],
				},
				title: {
					label: "Title",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textTransform",
						"textWrap",
					],
				},
				description: {
					label: "Description",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textWrap",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	variant: "default",
	title: "Heads up",
	// DOC-01 §5.14 shows `""`; a declared style target must have a stamped
	// element in the DEFAULT DOM or the authoring-parity suite fails, so the
	// default carries copy (identical deviation to the `card` package).
	// Empty-collapse behaviour for authors is unchanged.
	description: "Something here needs your attention.",
} satisfies AlertProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<AlertAuthorableProps> {
	return {
		...authoringFields,
		// Codegen output guarded by `check:fields-drift` (FR-003).
		variant: {
			type: "radio",
			label: t("alert.fields.variant.label"),
			options: variantOptions.map((value) => ({
				label: t(`alert.fields.variant.options.${value}`),
				value,
			})),
		},
		title: {
			type: "text",
			label: t("alert.fields.title.label"),
		},
		description: {
			type: "textarea",
			label: t("alert.fields.description.label"),
		},
		animation: animationField({
			label: t("alert.fields.animation.label"),
			preset: t("alert.fields.animation.preset"),
			presetOptions: {
				none: t("alert.fields.animation.preset.options.none"),
				"fade-in": t("alert.fields.animation.preset.options.fade-in"),
				"slide-up": t("alert.fields.animation.preset.options.slide-up"),
				"slide-down": t("alert.fields.animation.preset.options.slide-down"),
				"zoom-in": t("alert.fields.animation.preset.options.zoom-in"),
			},
			duration: t("alert.fields.animation.duration"),
			delay: t("alert.fields.animation.delay"),
			easing: t("alert.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`alert.targets.${targetId}`),
			})),
			t("alert.fields.classNames.label"),
		),
	};
}

const renderAlert: ComponentConfig<AlertAuthorableProps>["render"] = ({
	id,
	variant,
	title,
	description,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Alert, {
		variant,
		title,
		description,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			title: anvilTargetAttrs(id, "title"),
			description: anvilTargetAttrs(id, "description"),
		} satisfies Record<Exclude<AlertTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `alert.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`alert.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<AlertAuthorableProps> {
	return {
		label: t("alert.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderAlert,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<AlertAuthorableProps>;

export const alertConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<AlertAuthorableProps>;

export const componentConfig = alertConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<AlertAuthorableProps> {
	return buildConfig(createT(options));
}

export const createAlertConfig = createComponentConfig;
