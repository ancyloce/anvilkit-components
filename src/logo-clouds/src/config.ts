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
import type { LogoCloudsProps } from "./LogoClouds";
import { LogoClouds } from "./LogoClouds";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type LogoCloudsAuthorableProps = AuthorableProps<LogoCloudsProps>;

export const metadata = {
	componentName: "LogoClouds",
	componentSlug: "logo-clouds",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5): root container + the `logos`
	// marquee region. Per-logo CSS is deliberately not exposed — logos
	// are array rows, not Puck nodes (§6.5's note for this component).
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Logo clouds",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"gap",
						"background",
						"opacity",
					],
				},
				logos: {
					label: "Logos",
					responsive: true,
					properties: ["display", "gap", "padding", "background", "opacity"],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	title: "Brands love us",
	subtitle:
		"Trusted by the teams building polished, high-performance products for the modern web.",
} satisfies LogoCloudsProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<LogoCloudsAuthorableProps> {
	return {
		...authoringFields,
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

const renderLogoClouds: ComponentConfig<LogoCloudsAuthorableProps>["render"] = ({
	id,
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
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: { logos: anvilTargetAttrs(id, "logos") },
	});

function buildConfig(t: T): ComponentConfig<LogoCloudsAuthorableProps> {
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

export const fields = buildFields(
	defaultT,
) satisfies Fields<LogoCloudsAuthorableProps>;

export const logoCloudsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<LogoCloudsAuthorableProps>;

export const componentConfig = logoCloudsConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<LogoCloudsAuthorableProps> {
	return buildConfig(createT(options));
}

export const createLogoCloudsConfig = createComponentConfig;
