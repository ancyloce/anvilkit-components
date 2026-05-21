import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { StatisticsProps } from "./Statistics";
import { Statistics } from "./Statistics";

export const metadata = {
	componentName: "Statistics",
	componentSlug: "statistics",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
} satisfies ComponentMetadata;

export const defaultProps = {
	title: "Statistics",
} satisfies StatisticsProps;

export const fields = {
	title: {
		type: "text",
		label: "Title",
	},
} satisfies Fields<StatisticsProps>;

const renderStatistics: ComponentConfig<StatisticsProps>["render"] = ({
	title,
	editMode,
}) =>
	createElement(Statistics, {
		title,
		editMode,
	});

export const statisticsConfig = {
	label: "Statistics",
	defaultProps,
	fields,
	metadata,
	render: renderStatistics,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<StatisticsProps>;

export const componentConfig = statisticsConfig;
