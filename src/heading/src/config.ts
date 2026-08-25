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
import type { HeadingProps } from "./Heading";
import { Heading } from "./Heading";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type HeadingAuthorableProps = AuthorableProps<HeadingProps>;

/**
 * PLAN-0027 §2.1 target map — derive it from the REAL DOM of
 * `Heading.tsx`: the semantic heading itself is the stable root target.
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Heading",
	componentSlug: "heading",
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
					label: "Heading",
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
	text: "Build something remarkable",
	level: "h2",
	alignment: "left",
} satisfies HeadingProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<HeadingAuthorableProps> {
	return {
		...authoringFields,
		text: {
			type: "text",
			label: t("heading.fields.text.label"),
		},
		level: {
			type: "select",
			label: t("heading.fields.level.label"),
			options: (["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((value) => ({
				label: t(`heading.fields.level.options.${value}`),
				value,
			})),
		},
		alignment: {
			type: "radio",
			label: t("heading.fields.alignment.label"),
			options: [
				{
					label: t("heading.fields.alignment.options.left"),
					value: "left",
				},
				{
					label: t("heading.fields.alignment.options.center"),
					value: "center",
				},
				{
					label: t("heading.fields.alignment.options.right"),
					value: "right",
				},
			],
		},
		animation: animationField({
			label: t("heading.fields.animation.label"),
			preset: t("heading.fields.animation.preset"),
			presetOptions: {
				none: t("heading.fields.animation.preset.options.none"),
				"fade-in": t("heading.fields.animation.preset.options.fade-in"),
				"slide-up": t("heading.fields.animation.preset.options.slide-up"),
				"slide-down": t("heading.fields.animation.preset.options.slide-down"),
				"zoom-in": t("heading.fields.animation.preset.options.zoom-in"),
			},
			duration: t("heading.fields.animation.duration"),
			delay: t("heading.fields.animation.delay"),
			easing: t("heading.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`heading.targets.${targetId}`),
			})),
			t("heading.fields.classNames.label"),
		),
	};
}

const renderHeading: ComponentConfig<HeadingAuthorableProps>["render"] = ({
	id,
	text,
	level,
	alignment,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Heading, {
		text,
		level,
		alignment,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `heading.targets.<id>` keys the
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
			label: t(`heading.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<HeadingAuthorableProps> {
	return {
		label: t("heading.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderHeading,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<HeadingAuthorableProps>;

export const headingConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<HeadingAuthorableProps>;

export const componentConfig = headingConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<HeadingAuthorableProps> {
	return buildConfig(createT(options));
}

export const createHeadingConfig = createComponentConfig;
