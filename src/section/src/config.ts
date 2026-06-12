import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { SectionProps } from "./Section";
import { Section } from "./Section";

export const metadata = {
	componentName: "Section",
	componentSlug: "section",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
} satisfies ComponentMetadata;

export const defaultProps = {
	badgeLabel: "Scale",
	headline: "Stop writing boilerplate.",
	highlightedHeadline: "Start building features.",
	description:
		"Your AI agent handles repetitive coding tasks, reviews every commit, and catches bugs before deployment. Spend time on architecture, not syntax.",
} satisfies SectionProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SectionProps> {
	return {
		badgeLabel: {
			type: "text",
			label: t("section.fields.badgeLabel.label"),
		},
		headline: {
			type: "text",
			label: t("section.fields.headline.label"),
		},
		highlightedHeadline: {
			type: "text",
			label: t("section.fields.highlightedHeadline.label"),
		},
		description: {
			type: "textarea",
			label: t("section.fields.description.label"),
		},
	};
}

const renderSection: ComponentConfig<SectionProps>["render"] = ({
	badgeLabel,
	headline,
	highlightedHeadline,
	description,
	editMode,
}) =>
	createElement(Section, {
		badgeLabel,
		headline,
		highlightedHeadline,
		description,
		editMode,
	});

function buildConfig(t: T): ComponentConfig<SectionProps> {
	return {
		label: t("section.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderSection,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<SectionProps>;

export const sectionConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SectionProps>;

export const componentConfig = sectionConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SectionProps> {
	return buildConfig(createT(options));
}

export const createSectionConfig = createComponentConfig;
