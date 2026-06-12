import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { type CreateComponentConfigOptions, createT } from "./i18n";
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

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<LogoCloudsProps> {
	return {
		title: {
			type: "text",
			label: t("logo-clouds.fields.title.label"),
		},
		subtitle: {
			type: "textarea",
			label: t("logo-clouds.fields.subtitle.label"),
		},
	};
}

const renderLogoClouds: ComponentConfig<LogoCloudsProps>["render"] = ({
	title,
	subtitle,
	marqueeAriaLabel,
	editMode,
}) =>
	createElement(LogoClouds, {
		title,
		subtitle,
		marqueeAriaLabel,
		editMode,
	});

function buildConfig(t: T): ComponentConfig<LogoCloudsProps> {
	return {
		label: t("logo-clouds.label"),
		defaultProps: {
			...defaultProps,
			marqueeAriaLabel: t("logo-clouds.a11y.marquee"),
		},
		fields: buildFields(t),
		metadata,
		render: renderLogoClouds,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<LogoCloudsProps>;

export const logoCloudsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<LogoCloudsProps>;

export const componentConfig = logoCloudsConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<LogoCloudsProps> {
	return buildConfig(createT(options));
}

export const createLogoCloudsConfig = createComponentConfig;
