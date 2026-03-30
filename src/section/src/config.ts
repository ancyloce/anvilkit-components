import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
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

export const fields = {
	badgeLabel: {
		type: "text",
		label: "Badge label",
	},
	headline: {
		type: "text",
		label: "Headline",
	},
	highlightedHeadline: {
		type: "text",
		label: "Highlighted headline",
	},
	description: {
		type: "textarea",
		label: "Description",
	},
} satisfies Fields<SectionProps>;

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

export const sectionConfig = {
	label: "Section",
	defaultProps,
	fields,
	metadata,
	render: renderSection,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<SectionProps>;

export const componentConfig = sectionConfig;
