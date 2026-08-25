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
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import type { BlockquoteProps } from "./Blockquote";
import { Blockquote } from "./Blockquote";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type BlockquoteAuthorableProps = AuthorableProps<BlockquoteProps>;

/** Stable targets derived from the semantic figure/blockquote DOM. */
const STYLE_TARGET_IDS = ["root", "quote", "citation"] as const;

type BlockquoteTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Blockquote",
	componentSlug: "blockquote",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "typography",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Blockquote",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				quote: {
					label: "Quote",
					responsive: true,
					properties: [
						"display",
						"margin",
						"maxWidth",
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
				citation: {
					label: "Citation",
					responsive: true,
					properties: [
						"display",
						"margin",
						"maxWidth",
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
			inlineText: [
				{ id: "quote", propPath: "quote", format: "plain" },
				{ id: "citation", propPath: "citation", format: "plain" },
			],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	quote: "Good tools make ambitious ideas easier to express.",
	citation: "The AnvilKit team",
} satisfies BlockquoteProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<BlockquoteAuthorableProps> {
	return {
		...authoringFields,
		quote: {
			type: "textarea",
			label: t("blockquote.fields.quote.label"),
		},
		citation: {
			type: "text",
			label: t("blockquote.fields.citation.label"),
		},
		animation: animationField({
			label: t("blockquote.fields.animation.label"),
			preset: t("blockquote.fields.animation.preset"),
			presetOptions: {
				none: t("blockquote.fields.animation.preset.options.none"),
				"fade-in": t("blockquote.fields.animation.preset.options.fade-in"),
				"slide-up": t("blockquote.fields.animation.preset.options.slide-up"),
				"slide-down": t(
					"blockquote.fields.animation.preset.options.slide-down",
				),
				"zoom-in": t("blockquote.fields.animation.preset.options.zoom-in"),
			},
			duration: t("blockquote.fields.animation.duration"),
			delay: t("blockquote.fields.animation.delay"),
			easing: t("blockquote.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`blockquote.targets.${targetId}`),
			})),
			t("blockquote.fields.classNames.label"),
		),
	};
}

const renderBlockquote: ComponentConfig<BlockquoteAuthorableProps>["render"] =
	({ id, quote, citation, classNames, animation, editMode }) =>
		createElement(Blockquote, {
			quote,
			citation,
			classNames,
			animation,
			editMode,
			rootAttrs: anvilRootAttrs(id),
			targetAttrs: {
				quote: anvilTargetAttrs(id, "quote"),
				citation: anvilTargetAttrs(id, "citation"),
			} satisfies Record<
				Exclude<BlockquoteTargetId, "root">,
				Record<string, string>
			>,
		});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`blockquote.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<BlockquoteAuthorableProps> {
	return {
		label: t("blockquote.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderBlockquote,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<BlockquoteAuthorableProps>;

export const blockquoteConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BlockquoteAuthorableProps>;

export const componentConfig = blockquoteConfig;

export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BlockquoteAuthorableProps> {
	return buildConfig(createT(options));
}

export const createBlockquoteConfig = createComponentConfig;
