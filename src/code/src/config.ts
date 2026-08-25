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
import type { CodeProps } from "./Code";
import { Code } from "./Code";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type CodeAuthorableProps = AuthorableProps<CodeProps>;

const STYLE_TARGET_IDS = ["root", "code"] as const;

type CodeTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Code",
	componentSlug: "code",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "typography",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Code block",
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
					],
				},
				code: {
					label: "Code",
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
						"textWrap",
					],
				},
			},
			inlineText: [{ id: "code", propPath: "code", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	code: 'const message = "Hello, AnvilKit";',
	language: "typescript",
	showLineNumbers: true,
} satisfies CodeProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<CodeAuthorableProps> {
	return {
		...authoringFields,
		code: {
			type: "textarea",
			label: t("code.fields.code.label"),
		},
		language: {
			type: "select",
			label: t("code.fields.language.label"),
			options: [
				{ label: t("code.fields.language.options.plain"), value: "plain" },
				{ label: t("code.fields.language.options.html"), value: "html" },
				{ label: t("code.fields.language.options.css"), value: "css" },
				{
					label: t("code.fields.language.options.javascript"),
					value: "javascript",
				},
				{
					label: t("code.fields.language.options.typescript"),
					value: "typescript",
				},
				{ label: t("code.fields.language.options.json"), value: "json" },
				{ label: t("code.fields.language.options.shell"), value: "shell" },
			],
		},
		showLineNumbers: {
			type: "radio",
			label: t("code.fields.showLineNumbers.label"),
			options: [
				{
					label: t("code.fields.showLineNumbers.options.true"),
					value: true,
				},
				{
					label: t("code.fields.showLineNumbers.options.false"),
					value: false,
				},
			],
		},
		animation: animationField({
			label: t("code.fields.animation.label"),
			preset: t("code.fields.animation.preset"),
			presetOptions: {
				none: t("code.fields.animation.preset.options.none"),
				"fade-in": t("code.fields.animation.preset.options.fade-in"),
				"slide-up": t("code.fields.animation.preset.options.slide-up"),
				"slide-down": t("code.fields.animation.preset.options.slide-down"),
				"zoom-in": t("code.fields.animation.preset.options.zoom-in"),
			},
			duration: t("code.fields.animation.duration"),
			delay: t("code.fields.animation.delay"),
			easing: t("code.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`code.targets.${targetId}`),
			})),
			t("code.fields.classNames.label"),
		),
	};
}

const renderCode: ComponentConfig<CodeAuthorableProps>["render"] = ({
	id,
	code,
	language,
	showLineNumbers,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Code, {
		code,
		language,
		showLineNumbers,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			code: anvilTargetAttrs(id, "code"),
		} satisfies Record<Exclude<CodeTargetId, "root">, Record<string, string>>,
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`code.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<CodeAuthorableProps> {
	return {
		label: t("code.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderCode,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<CodeAuthorableProps>;
export const codeConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<CodeAuthorableProps>;
export const componentConfig = codeConfig;

export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<CodeAuthorableProps> {
	return buildConfig(createT(options));
}

export const createCodeConfig = createComponentConfig;
