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
import type { HeroProps } from "./Hero";
import { Hero } from "./Hero";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type HeroAuthorableProps = AuthorableProps<HeroProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Hero.tsx:
 * the root `<section>`, the centered `content` column, the announcement
 * `badge` (both the interactive `<a>` and the static button branch),
 * the `headline` h1, the `description` p, the `actions` row, and the
 * two download CTAs sharing one `cta` id stamped on every instance
 * (both the interactive `<a>`-rendered and the disabled-button branch).
 * DEVIATION vs the §6.5 sketch, confirmed against the real DOM: Hero
 * renders NO media element (no img/video anywhere), so no `media`
 * target exists — fabricating an empty container would be the §8.5
 * fabrication this phase removes.
 */
const STYLE_TARGET_IDS = [
	"root",
	"content",
	"badge",
	"headline",
	"description",
	"actions",
	"cta",
] as const;

type HeroTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Hero",
	componentSlug: "hero",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets (legacy v1 block deleted per PLAN-0027 §2.5). Allowlists
	// use only the grantable §6.1 vocabulary; typography properties are
	// granted on text-bearing targets only.
	// p6-003 widening rule: `content` is this package's one `zIndex`
	// grant. `.anvilkit-hero` sets `isolation: isolate` (styles.css:107),
	// so the stacking cannot escape the component, and `content` genuinely
	// overlaps `.anvilkit-hero__backdrop` — flagged for p8-006 regardless,
	// as every zIndex grant is. `content`/`actions`/`badge` are flex
	// containers and take `direction`/`wrap`/`rowGap`/`columnGap`; `badge`
	// and `cta` are the interactive controls and the only `cursor` grants;
	// `overflow` goes where a radius is already granted or the element
	// already clips.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Hero",
					responsive: true,
					properties: [
						"display",
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
						"minHeight",
						"maxHeight",
						"overflow",
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
						"opacity",
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
						"minHeight",
						"maxHeight",
						"zIndex",
					],
				},
				badge: {
					label: "Announcement badge",
					responsive: true,
					properties: [
						"display",
						"gap",
						"height",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
						"minHeight",
						"maxHeight",
						"overflow",
						"cursor",
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
				headline: {
					label: "Headline",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textDecoration",
						"textTransform",
						"textWrap",
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
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
				actions: {
					label: "Actions",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"opacity",
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
					],
				},
				cta: {
					label: "CTA buttons",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"minHeight",
						"maxHeight",
						"overflow",
						"cursor",
						"textDecoration",
						"textTransform",
						"textWrap",
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
		animation: animationField({
			label: t("hero.fields.animation.label"),
			preset: t("hero.fields.animation.preset"),
			presetOptions: {
				none: t("hero.fields.animation.preset.options.none"),
				"fade-in": t("hero.fields.animation.preset.options.fade-in"),
				"slide-up": t("hero.fields.animation.preset.options.slide-up"),
				"slide-down": t("hero.fields.animation.preset.options.slide-down"),
				"zoom-in": t("hero.fields.animation.preset.options.zoom-in"),
			},
			duration: t("hero.fields.animation.duration"),
			delay: t("hero.fields.animation.delay"),
			easing: t("hero.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`hero.targets.${targetId}`),
			})),
			t("hero.fields.classNames.label"),
		),
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
			actions: anvilTargetAttrs(props.id, "actions"),
			cta: anvilTargetAttrs(props.id, "cta"),
		} satisfies Record<Exclude<HeroTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `hero.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label. Under
 * the default (en) `t` each label resolves to the literal declared
 * above, so the static `componentConfig` export is unchanged.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`hero.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<HeroAuthorableProps> {
	return {
		label: t("hero.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
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
