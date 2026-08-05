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
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { StatisticsProps } from "./Statistics";
import { Statistics } from "./Statistics";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type StatisticsAuthorableProps = AuthorableProps<StatisticsProps>;

export const metadata = {
	componentName: "Statistics",
	componentSlug: "statistics",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5). DEVIATION confirmed against
	// the real DOM: the view renders only the title plus a decorative
	// grid — `metrics` produce no DOM at all — so no `items` target
	// exists to declare.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Statistics",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"opacity",
					],
				},
			},
			inlineText: [{ id: "title", propPath: "title", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	title: "Statistics",
	dataSource: "static",
	metrics: [],
} satisfies StatisticsProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<StatisticsAuthorableProps> {
	return {
		...authoringFields,
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

const renderStatistics: ComponentConfig<StatisticsAuthorableProps>["render"] = ({
	id,
	title,
	editMode,
}) =>
	createElement(Statistics, {
		title,
		editMode,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
	});

function buildConfig(t: T): ComponentConfig<StatisticsAuthorableProps> {
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

export const fields = buildFields(
	defaultT,
) satisfies Fields<StatisticsAuthorableProps>;

export const statisticsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<StatisticsAuthorableProps>;

export const componentConfig = statisticsConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<StatisticsAuthorableProps> {
	return buildConfig(createT(options));
}

export const createStatisticsConfig = createComponentConfig;
