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
import type { HeroProps } from "./Hero";
import { Hero } from "./Hero";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type HeroAuthorableProps = AuthorableProps<HeroProps>;

export const metadata = {
	componentName: "Hero",
	componentSlug: "hero",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// AnvilKit visual-editor capability declaration (contract:
	// `EditorCapabilityMetadata` in `@anvilkit/contracts/editor` —
	// mirrored literally to avoid a new dependency). `styleTarget:
	// "root"`: Hero spreads `editorDataAttributes` onto its root
	// section; the h1/p carry `data-ak-text-target` stamps for the
	// inline targets. Typography stays undeclared — the headline and
	// description set their own text classes.
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
	// DEVIATION vs the §6.5 sketch, confirmed against the real DOM:
	// Hero has NO media element (no img/video anywhere in the render),
	// so no `media` target exists — fabricating an empty container
	// would be the §8.5 fabrication this phase removes. Typography
	// stays ungranted for the same fixed-text-class reason as v1.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Hero",
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
				content: {
					label: "Content",
					responsive: true,
					properties: ["width", "maxWidth", "padding", "gap", "opacity"],
				},
				actions: {
					label: "Actions",
					responsive: true,
					properties: [
						"display",
						"gap",
						"margin",
						"padding",
						"width",
						"maxWidth",
						"alignItems",
						"justifyContent",
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
	announcementLabel: "We raised $69M pre seed",
	announcementHref: "",
	announcementOpenInNewTab: false,
	headline: "Write fast with\naccurate precision.",
	description:
		"Our state of the art tool is a tool that allows you to\nwrite copy instantly.",
	linuxLabel: "Download for Linux",
	linuxHref: "/download/linux",
	linuxOpenInNewTab: false,
	windowsLabel: "Download for Windows",
	windowsHref: "/download/windows",
	windowsOpenInNewTab: false,
} satisfies HeroProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<HeroAuthorableProps> {
	return {
		...authoringFields,
		announcementLabel: {
			type: "text",
			label: t("hero.fields.announcementLabel.label"),
		},
		announcementHref: {
			type: "text",
			label: t("hero.fields.announcementHref.label"),
		},
		announcementOpenInNewTab: {
			type: "radio",
			label: t("hero.fields.announcementOpenInNewTab.label"),
			options: [
				{
					label: t("hero.fields.announcementOpenInNewTab.options.false"),
					value: false,
				},
				{
					label: t("hero.fields.announcementOpenInNewTab.options.true"),
					value: true,
				},
			],
		},
		headline: {
			type: "textarea",
			label: t("hero.fields.headline.label"),
		},
		description: {
			type: "textarea",
			label: t("hero.fields.description.label"),
		},
		linuxLabel: {
			type: "text",
			label: t("hero.fields.linuxLabel.label"),
		},
		linuxHref: {
			type: "text",
			label: t("hero.fields.linuxHref.label"),
		},
		linuxOpenInNewTab: {
			type: "radio",
			label: t("hero.fields.linuxOpenInNewTab.label"),
			options: [
				{
					label: t("hero.fields.linuxOpenInNewTab.options.false"),
					value: false,
				},
				{
					label: t("hero.fields.linuxOpenInNewTab.options.true"),
					value: true,
				},
			],
		},
		windowsLabel: {
			type: "text",
			label: t("hero.fields.windowsLabel.label"),
		},
		windowsHref: {
			type: "text",
			label: t("hero.fields.windowsHref.label"),
		},
		windowsOpenInNewTab: {
			type: "radio",
			label: t("hero.fields.windowsOpenInNewTab.label"),
			options: [
				{
					label: t("hero.fields.windowsOpenInNewTab.options.false"),
					value: false,
				},
				{
					label: t("hero.fields.windowsOpenInNewTab.options.true"),
					value: true,
				},
			],
		},
	};
}

/** Editor-injected render props (present only when authoring is on). */
type EditorRenderProps = {
	editorDataAttributes?: Readonly<Record<string, string>>;
};

const renderHero: ComponentConfig<HeroAuthorableProps>["render"] = (props) =>
	createElement(Hero, {
		announcementLabel: props.announcementLabel,
		announcementHref: props.announcementHref,
		announcementOpenInNewTab: props.announcementOpenInNewTab,
		headline: props.headline,
		description: props.description,
		linuxLabel: props.linuxLabel,
		linuxHref: props.linuxHref,
		linuxOpenInNewTab: props.linuxOpenInNewTab,
		windowsLabel: props.windowsLabel,
		windowsHref: props.windowsHref,
		windowsOpenInNewTab: props.windowsOpenInNewTab,
		editMode: props.editMode,
		editorDataAttributes: (props as EditorRenderProps).editorDataAttributes,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(props.id),
		targetAttrs: {
			content: anvilTargetAttrs(props.id, "content"),
			actions: anvilTargetAttrs(props.id, "actions"),
		},
	});

function buildConfig(t: T): ComponentConfig<HeroAuthorableProps> {
	return {
		label: t("hero.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderHero,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<HeroAuthorableProps>;

export const heroConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<HeroAuthorableProps>;

export const componentConfig = heroConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<HeroAuthorableProps> {
	return buildConfig(createT(options));
}

export const createHeroConfig = createComponentConfig;
