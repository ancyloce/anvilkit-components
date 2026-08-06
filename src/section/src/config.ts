import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { SectionProps } from "./Section";
import { Section } from "./Section";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type SectionAuthorableProps = AuthorableProps<SectionProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Section.tsx
 * (a single render branch): the root `<div>`, the centered `content`
 * container, the rounded `badge` pill, the `<h2>` headline, and the
 * description `<p>`. The badge/content containers grant no typography —
 * their text children carry fixed element-level text classes an
 * inherited override would not beat (the rationale recorded by the
 * deleted v1 block); headline/description are the text-bearing targets.
 */
const STYLE_TARGET_IDS = [
	"root",
	"content",
	"badge",
	"headline",
	"description",
] as const;

type SectionTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Section",
	componentSlug: "section",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Section",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
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
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				badge: {
					label: "Badge",
					responsive: true,
					properties: [
						"display",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				headline: {
					label: "Headline",
					responsive: true,
					properties: [
						"display",
						"margin",
						"maxWidth",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
				description: {
					label: "Description",
					responsive: true,
					properties: [
						"display",
						"margin",
						"maxWidth",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
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
		animation: animationField({
			label: t("section.fields.animation.label"),
			preset: t("section.fields.animation.preset"),
			presetOptions: {
				none: t("section.fields.animation.preset.options.none"),
				"fade-in": t("section.fields.animation.preset.options.fade-in"),
				"slide-up": t("section.fields.animation.preset.options.slide-up"),
				"slide-down": t("section.fields.animation.preset.options.slide-down"),
				"zoom-in": t("section.fields.animation.preset.options.zoom-in"),
			},
			duration: t("section.fields.animation.duration"),
			delay: t("section.fields.animation.delay"),
			easing: t("section.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`section.targets.${targetId}`),
			})),
			t("section.fields.classNames.label"),
		),
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
		classNames: props.classNames,
		animation: props.animation,
		editMode: props.editMode,
		editorDataAttributes: (props as EditorRenderProps).editorDataAttributes,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(props.id),
		targetAttrs: {
			content: anvilTargetAttrs(props.id, "content"),
			badge: anvilTargetAttrs(props.id, "badge"),
			headline: anvilTargetAttrs(props.id, "headline"),
			description: anvilTargetAttrs(props.id, "description"),
		} satisfies Record<
			Exclude<SectionTargetId, "root">,
			Record<string, string>
		>,
	});

function buildConfig(t: T): ComponentConfig<SectionAuthorableProps> {
	return {
		label: t("section.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderSection,
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
