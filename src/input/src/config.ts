import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { Input } from "./Input";
import type { InputProps } from "./Input";

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

export const fields = {
	label: {
		type: "text",
		label: "Label",
	},
	name: {
		type: "text",
		label: "Name",
	},
	type: {
		type: "select",
		label: "Type",
		options: [
			{
				label: "Text",
				value: "text",
			},
			{
				label: "Email",
				value: "email",
			},
			{
				label: "Password",
				value: "password",
			},
			{
				label: "Search",
				value: "search",
			},
			{
				label: "Telephone",
				value: "tel",
			},
			{
				label: "URL",
				value: "url",
			},
		],
	},
	placeholder: {
		type: "text",
		label: "Placeholder",
	},
	helperText: {
		type: "textarea",
		label: "Helper text",
	},
	defaultValue: {
		type: "text",
		label: "Default value",
	},
	required: {
		type: "radio",
		label: "Required",
		options: [
			{
				label: "No",
				value: false,
			},
			{
				label: "Yes",
				value: true,
			},
		],
	},
	disabled: {
		type: "radio",
		label: "Disabled",
		options: [
			{
				label: "No",
				value: false,
			},
			{
				label: "Yes",
				value: true,
			},
		],
	},
} satisfies Fields<InputProps>;

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

export const inputConfig = {
	label: "Input",
	defaultProps,
	fields,
	metadata,
	render: renderInput,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<InputProps>;

export const componentConfig = inputConfig;
