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
import type { RichTextProps } from "./RichText";
import { RichText } from "./RichText";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type RichTextAuthorableProps = AuthorableProps<RichTextProps>;

/**
 * PLAN-0027 §2.1 target map — derive it from the REAL DOM of
 * `RichText.tsx`: the rich content container is the stable root target.
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "RichText",
	componentSlug: "rich-text",
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
					label: "Rich Text",
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
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	content:
		"<p>Write and format longer content with headings, lists, emphasis, and quotations.</p>",
	alignment: "left",
} satisfies RichTextProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<RichTextAuthorableProps> {
	return {
		...authoringFields,
		content: {
			type: "richtext",
			label: t("rich-text.fields.content.label"),
			contentEditable: true,
		},
		alignment: {
			type: "radio",
			label: t("rich-text.fields.alignment.label"),
			options: [
				{
					label: t("rich-text.fields.alignment.options.left"),
					value: "left",
				},
				{
					label: t("rich-text.fields.alignment.options.center"),
					value: "center",
				},
				{
					label: t("rich-text.fields.alignment.options.right"),
					value: "right",
				},
			],
		},
		animation: animationField({
			label: t("rich-text.fields.animation.label"),
			preset: t("rich-text.fields.animation.preset"),
			presetOptions: {
				none: t("rich-text.fields.animation.preset.options.none"),
				"fade-in": t("rich-text.fields.animation.preset.options.fade-in"),
				"slide-up": t("rich-text.fields.animation.preset.options.slide-up"),
				"slide-down": t("rich-text.fields.animation.preset.options.slide-down"),
				"zoom-in": t("rich-text.fields.animation.preset.options.zoom-in"),
			},
			duration: t("rich-text.fields.animation.duration"),
			delay: t("rich-text.fields.animation.delay"),
			easing: t("rich-text.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`rich-text.targets.${targetId}`),
			})),
			t("rich-text.fields.classNames.label"),
		),
	};
}

const renderRichText: ComponentConfig<RichTextAuthorableProps>["render"] = ({
	id,
	content,
	alignment,
	classNames,
	animation,
	editMode,
}) =>
	createElement(RichText, {
		content,
		alignment,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `rich-text.targets.<id>` keys the
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
			label: t(`rich-text.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<RichTextAuthorableProps> {
	return {
		label: t("rich-text.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderRichText,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<RichTextAuthorableProps>;

export const richTextConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<RichTextAuthorableProps>;

export const componentConfig = richTextConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<RichTextAuthorableProps> {
	return buildConfig(createT(options));
}

export const createRichTextConfig = createComponentConfig;
