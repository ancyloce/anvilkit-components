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
import type { SectionProps } from "./Section";
import { Section } from "./Section";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type SectionAuthorableProps = AuthorableProps<SectionProps>;

export const metadata = {
	componentName: "Section",
	componentSlug: "section",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// AnvilKit visual-editor capability declaration (contract:
	// `EditorCapabilityMetadata` in `@anvilkit/contracts/editor` —
	// mirrored literally to avoid a new dependency). `styleTarget:
	// "root"`: Section spreads `editorDataAttributes` onto its root
	// div. Only honoured capabilities are declared: typography is
	// deliberately absent because the headline/description carry
	// fixed text classes a root-level override would not beat.
	editor: {
		version: "1",
		styleTarget: "root",
		capabilities: {
			layoutItem: true,
			visualStyle: true,
			responsive: true,
			inlineText: [
				{ id: "headline", propPath: "headline", format: "plain" },
				{ id: "description", propPath: "description", format: "plain" },
			],
		},
	},
	// PLAN-0025 metadata v2 (§6.1/§6.5), alongside v1 until cutover.
	// Deviations from the §6.5 sketch, confirmed against the real DOM:
	// Section carries no slot (fixed marketing copy, no renderDropZone),
	// and `content` grants effective layout only — inherited typography
	// on the container loses to the headline/description's fixed
	// element-level text classes (same rationale as v1's note above).
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Section",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				content: {
					label: "Content",
					responsive: true,
					properties: ["width", "maxWidth", "padding", "gap"],
				},
			},
			inlineText: [
				{ id: "headline", propPath: "headline", format: "plain" },
				{ id: "description", propPath: "description", format: "plain" },
			],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	badgeLabel: "Scale",
	headline: "Stop writing boilerplate.",
	highlightedHeadline: "Start building features.",
	description:
		"Your AI agent handles repetitive coding tasks, reviews every commit, and catches bugs before deployment. Spend time on architecture, not syntax.",
} satisfies SectionProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SectionAuthorableProps> {
	return {
		...authoringFields,
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

/** Editor-injected render props (present only when authoring is on). */
type EditorRenderProps = {
	editorDataAttributes?: Readonly<Record<string, string>>;
};

const renderSection: ComponentConfig<SectionAuthorableProps>["render"] = (
	props,
) =>
	createElement(Section, {
		badgeLabel: props.badgeLabel,
		headline: props.headline,
		highlightedHeadline: props.highlightedHeadline,
		description: props.description,
		editMode: props.editMode,
		editorDataAttributes: (props as EditorRenderProps).editorDataAttributes,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(props.id),
		targetAttrs: { content: anvilTargetAttrs(props.id, "content") },
	});

function buildConfig(t: T): ComponentConfig<SectionAuthorableProps> {
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

export const fields = buildFields(
	defaultT,
) satisfies Fields<SectionAuthorableProps>;

export const sectionConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SectionAuthorableProps>;

export const componentConfig = sectionConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SectionAuthorableProps> {
	return buildConfig(createT(options));
}

export const createSectionConfig = createComponentConfig;
