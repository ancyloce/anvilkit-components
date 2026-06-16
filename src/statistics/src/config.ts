import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { type CreateComponentConfigOptions, createT } from "./i18n";
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
	dataSource: "static",
	metrics: [],
} satisfies StatisticsProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<StatisticsProps> {
	return {
		title: {
			type: "text",
			label: t("statistics.fields.title.label"),
		},
		dataSource: {
			type: "radio",
			label: t("statistics.fields.dataSource.label"),
			options: [
				{
					label: t("statistics.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("statistics.fields.dataSource.options.remote_csv"),
					value: "remote_csv",
				},
			],
		},
		metrics: {
			type: "array",
			label: t("statistics.fields.metrics.label"),
			arrayFields: {
				label: {
					type: "text",
					label: t("statistics.fields.metrics.fields.label.label"),
				},
				value: {
					type: "text",
					label: t("statistics.fields.metrics.fields.value.label"),
				},
			},
		},
	};
}

const renderStatistics: ComponentConfig<StatisticsProps>["render"] = ({
	title,
	editMode,
}) =>
	createElement(Statistics, {
		title,
		editMode,
	});

function buildConfig(t: T): ComponentConfig<StatisticsProps> {
	return {
		label: t("statistics.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderStatistics,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<StatisticsProps>;

export const statisticsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<StatisticsProps>;

export const componentConfig = statisticsConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<StatisticsProps> {
	return buildConfig(createT(options));
}

export const createStatisticsConfig = createComponentConfig;
