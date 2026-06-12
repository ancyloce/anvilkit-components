import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { InputProps } from "./Input";
import { Input } from "./Input";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export const metadata = {
	componentName: "Input",
	componentSlug: "input",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "forms",
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

function buildFields(t: T): Fields<InputProps> {
	return {
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

const renderInput: ComponentConfig<InputProps>["render"] = ({
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
	});

function buildConfig(t: T): ComponentConfig<InputProps> {
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

export const fields = buildFields(defaultT) satisfies Fields<InputProps>;

export const inputConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<InputProps>;

export const componentConfig = inputConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<InputProps> {
	return buildConfig(createT(options));
}

export const createInputConfig = createComponentConfig;
