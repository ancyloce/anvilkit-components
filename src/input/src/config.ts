import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import {
	type AuthorableProps,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
} from "./authoring";
import type { InputProps } from "./Input";
import { Input } from "./Input";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type InputAuthorableProps = AuthorableProps<InputProps>;

export const metadata = {
	componentName: "Input",
	componentSlug: "input",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "forms",
	// PLAN-0025 metadata v2 (§6.1/§6.5): root layout, control
	// visual/typography, label typography. State rules (`:focus`) stay
	// component-owned; author values never carry `!important`.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Field",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"gap",
					],
				},
				control: {
					label: "Control",
					responsive: true,
					properties: [
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"padding",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
					],
				},
				label: {
					label: "Label",
					properties: [
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
			},
			inlineText: [
				{ id: "label", propPath: "label", format: "plain" },
				{ id: "helperText", propPath: "helperText", format: "plain" },
			],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	label: "Email address",
	name: "email",
	type: "email",
	placeholder: "Enter your email",
	helperText: "We will only use this for important updates.",
	defaultValue: "",
	required: false,
	disabled: false,
} satisfies InputProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<InputAuthorableProps> {
	return {
		...authoringFields,
		label: {
			type: "text",
			label: t("input.fields.label.label"),
		},
		name: {
			type: "text",
			label: t("input.fields.name.label"),
		},
		type: {
			type: "select",
			label: t("input.fields.type.label"),
			options: [
				{
					label: t("input.fields.type.options.text"),
					value: "text",
				},
				{
					label: t("input.fields.type.options.email"),
					value: "email",
				},
				{
					label: t("input.fields.type.options.password"),
					value: "password",
				},
				{
					label: t("input.fields.type.options.search"),
					value: "search",
				},
				{
					label: t("input.fields.type.options.tel"),
					value: "tel",
				},
				{
					label: t("input.fields.type.options.url"),
					value: "url",
				},
			],
		},
		placeholder: {
			type: "text",
			label: t("input.fields.placeholder.label"),
		},
		helperText: {
			type: "textarea",
			label: t("input.fields.helperText.label"),
		},
		defaultValue: {
			type: "text",
			label: t("input.fields.defaultValue.label"),
		},
		required: {
			type: "radio",
			label: t("input.fields.required.label"),
			options: [
				{
					label: t("input.fields.required.options.false"),
					value: false,
				},
				{
					label: t("input.fields.required.options.true"),
					value: true,
				},
			],
		},
		disabled: {
			type: "radio",
			label: t("input.fields.disabled.label"),
			options: [
				{
					label: t("input.fields.disabled.options.false"),
					value: false,
				},
				{
					label: t("input.fields.disabled.options.true"),
					value: true,
				},
			],
		},
	};
}

const renderInput: ComponentConfig<InputAuthorableProps>["render"] = ({
	id,
	label,
	name,
	type,
	placeholder,
	helperText,
	defaultValue,
	required,
	disabled,
	editMode,
}) =>
	createElement(Input, {
		label,
		name,
		type,
		placeholder,
		helperText,
		defaultValue,
		required,
		disabled,
		editMode,
		// §6.2: stable targets from the official render; the compiler
		// owns CSS materialization.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			control: anvilTargetAttrs(id, "control"),
			label: anvilTargetAttrs(id, "label"),
		},
	});

function buildConfig(t: T): ComponentConfig<InputAuthorableProps> {
	return {
		label: t("input.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderInput,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<InputAuthorableProps>;

export const inputConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<InputAuthorableProps>;

export const componentConfig = inputConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<InputAuthorableProps> {
	return buildConfig(createT(options));
}

export const createInputConfig = createComponentConfig;
