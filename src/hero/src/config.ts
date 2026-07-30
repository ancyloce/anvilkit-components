import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { HeroProps } from "./Hero";
import { Hero } from "./Hero";
import { type CreateComponentConfigOptions, createT } from "./i18n";

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

function buildFields(t: T): Fields<HeroProps> {
	return {
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

const renderHero: ComponentConfig<HeroProps>["render"] = (props) =>
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
	});

function buildConfig(t: T): ComponentConfig<HeroProps> {
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

export const fields = buildFields(defaultT) satisfies Fields<HeroProps>;

export const heroConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<HeroProps>;

export const componentConfig = heroConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<HeroProps> {
	return buildConfig(createT(options));
}

export const createHeroConfig = createComponentConfig;
