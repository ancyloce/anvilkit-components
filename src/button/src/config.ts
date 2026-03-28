import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

export const metadata = {
	componentName: "Button",
	componentSlug: "button",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "actions",
} satisfies ComponentMetadata;

export const defaultProps = {
	label: "Save changes",
	variant: "primary",
	disabled: false,
	href: "",
	openInNewTab: false,
} satisfies ButtonProps;

export const fields = {
	label: {
		type: "text",
		label: "Label",
	},
	variant: {
		type: "radio",
		label: "Variant",
		options: [
			{
				label: "Primary",
				value: "primary",
			},
			{
				label: "Secondary",
				value: "secondary",
			},
		],
	},
	href: {
		type: "text",
		label: "Link URL",
	},
	openInNewTab: {
		type: "radio",
		label: "Open in new tab",
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
} satisfies Fields<ButtonProps>;

const renderButton: ComponentConfig<ButtonProps>["render"] = ({
	label,
	variant,
	disabled,
	href,
	openInNewTab,
	editMode,
}) =>
	createElement(Button, {
		label,
		variant,
		disabled,
		href,
		openInNewTab,
		editMode,
	});

export const buttonConfig = {
	label: "Button",
	defaultProps,
	fields,
	metadata,
	render: renderButton,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<ButtonProps>;

export const componentConfig = buttonConfig;
