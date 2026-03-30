import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { LogoCloudsProps } from "./LogoClouds";
import { LogoClouds } from "./LogoClouds";

export const metadata = {
	componentName: "LogoClouds",
	componentSlug: "logo-clouds",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
} satisfies ComponentMetadata;

export const defaultProps = {
	title: "Brands love us",
	subtitle:
		"Trusted by the teams building polished, high-performance products for the modern web.",
} satisfies LogoCloudsProps;

export const fields = {
	title: {
		type: "text",
		label: "Title",
	},
	subtitle: {
		type: "textarea",
		label: "Subtitle",
	},
} satisfies Fields<LogoCloudsProps>;

const renderLogoClouds: ComponentConfig<LogoCloudsProps>["render"] = ({
	title,
	subtitle,
	editMode,
}) =>
	createElement(LogoClouds, {
		title,
		subtitle,
		editMode,
	});

export const logoCloudsConfig = {
	label: "Logo Clouds",
	defaultProps,
	fields,
	metadata,
	render: renderLogoClouds,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<LogoCloudsProps>;

export const componentConfig = logoCloudsConfig;
