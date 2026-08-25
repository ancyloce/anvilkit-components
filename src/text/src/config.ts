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
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { TextProps } from "./Text";
import { Text } from "./Text";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type TextAuthorableProps = AuthorableProps<TextProps>;

/**
 * PLAN-0027 §2.1 target map — derive it from the REAL DOM of
 * `Text.tsx`: the paragraph itself is the stable root target.
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Text",
	componentSlug: "text",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "typography",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Text",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
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
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
			},
			inlineText: [{ id: "root", propPath: "text", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	text: "Add supporting copy that helps readers understand this section.",
	variant: "default",
	alignment: "left",
} satisfies TextProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<TextAuthorableProps> {
	return {
		...authoringFields,
		text: {
			type: "textarea",
			label: t("text.fields.text.label"),
		},
		variant: {
			type: "select",
			label: t("text.fields.variant.label"),
			options: (["default", "lead", "muted", "small"] as const).map(
				(value) => ({
					label: t(`text.fields.variant.options.${value}`),
					value,
				}),
			),
		},
		alignment: {
			type: "radio",
			label: t("text.fields.alignment.label"),
			options: [
				{
					label: t("text.fields.alignment.options.left"),
					value: "left",
				},
				{
					label: t("text.fields.alignment.options.center"),
					value: "center",
				},
				{
					label: t("text.fields.alignment.options.right"),
					value: "right",
				},
			],
		},
		animation: animationField({
			label: t("text.fields.animation.label"),
			preset: t("text.fields.animation.preset"),
			presetOptions: {
				none: t("text.fields.animation.preset.options.none"),
				"fade-in": t("text.fields.animation.preset.options.fade-in"),
				"slide-up": t("text.fields.animation.preset.options.slide-up"),
				"slide-down": t("text.fields.animation.preset.options.slide-down"),
				"zoom-in": t("text.fields.animation.preset.options.zoom-in"),
			},
			duration: t("text.fields.animation.duration"),
			delay: t("text.fields.animation.delay"),
			easing: t("text.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`text.targets.${targetId}`),
			})),
			t("text.fields.classNames.label"),
		),
	};
}

const renderText: ComponentConfig<TextAuthorableProps>["render"] = ({
	id,
	text,
	variant,
	alignment,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Text, {
		text,
		variant,
		alignment,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `text.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label. Under
 * the default (en) `t` each label resolves to the literal declared
 * above, so the static `componentConfig` export is unchanged. Every new
 * target added to STYLE_TARGET_IDS localizes automatically.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`text.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<TextAuthorableProps> {
	return {
		label: t("text.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderText,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<TextAuthorableProps>;

export const textConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<TextAuthorableProps>;

export const componentConfig = textConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<TextAuthorableProps> {
	return buildConfig(createT(options));
}

export const createTextConfig = createComponentConfig;
