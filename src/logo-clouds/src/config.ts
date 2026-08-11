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
import type { LogoCloudsProps } from "./LogoClouds";
import { LogoClouds } from "./LogoClouds";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type LogoCloudsAuthorableProps = AuthorableProps<LogoCloudsProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of
 * LogoClouds.tsx: the root `<section>`, the shimmering heading, the
 * subtitle `<p>`, the marquee region, and — per §2.1's repeated-item
 * rule — ONE shared `logoItem`/`logoImage` pair stamped on every logo
 * instance the marquee emits. The component has a single render branch,
 * so every declared target exists in every mode.
 *
 * `title` deliberately omits `color`/`display`/`position`: ShimmeringText
 * sets all three as INLINE styles (and animates the per-character
 * colour), so a CSS grant could never win — declaring them would be a
 * silent no-op.
 */
const STYLE_TARGET_IDS = [
	"root",
	"title",
	"subtitle",
	"logos",
	"logoItem",
	"logoImage",
] as const;

type LogoCloudsTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "LogoClouds",
	componentSlug: "logo-clouds",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only.
	// p6-003 widening rule: `logos` is NOT a grid despite its name — it is
	// `relative flex flex-col … overflow-hidden` (LogoClouds.tsx:71-72), so
	// it takes `direction`/`wrap`, not `columns`/`rows`; this package
	// declares no grid container at all. `logoImage` is the replaced
	// element and the only `filter`/`blendMode` grant. `title` extends the
	// ShimmeringText exclusion below: `textTransform`/`textWrap` are
	// granted but `textDecoration` is NOT, because the primitive splits the
	// text into per-character `display:inline-block` spans and decoration
	// does not propagate into an inline-block descendant.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Logo clouds",
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
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
						"minHeight",
						"maxHeight",
						"overflow",
					],
				},
				title: {
					label: "Title",
					responsive: true,
					properties: [
						"width",
						"maxWidth",
						"margin",
						"padding",
						"opacity",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textTransform",
						"textWrap",
					],
				},
				subtitle: {
					label: "Subtitle",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
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
				logos: {
					label: "Logos",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
						"minHeight",
						"maxHeight",
						"overflow",
					],
				},
				logoItem: {
					label: "Logo item",
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
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
						"minHeight",
						"maxHeight",
						"overflow",
					],
				},
				logoImage: {
					label: "Logo image",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"height",
						"margin",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"minHeight",
						"maxHeight",
						"filter",
						"blendMode",
					],
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
		animation: animationField({
			label: t("logo-clouds.fields.animation.label"),
			preset: t("logo-clouds.fields.animation.preset"),
			presetOptions: {
				none: t("logo-clouds.fields.animation.preset.options.none"),
				"fade-in": t("logo-clouds.fields.animation.preset.options.fade-in"),
				"slide-up": t("logo-clouds.fields.animation.preset.options.slide-up"),
				"slide-down": t(
					"logo-clouds.fields.animation.preset.options.slide-down",
				),
				"zoom-in": t("logo-clouds.fields.animation.preset.options.zoom-in"),
			},
			duration: t("logo-clouds.fields.animation.duration"),
			delay: t("logo-clouds.fields.animation.delay"),
			easing: t("logo-clouds.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`logo-clouds.targets.${targetId}`),
			})),
			t("logo-clouds.fields.classNames.label"),
		),
	};
}

const renderLogoClouds: ComponentConfig<LogoCloudsAuthorableProps>["render"] =
	({
		id,
		title,
		subtitle,
		marqueeAriaLabel,
		classNames,
		animation,
		editMode,
	}) =>
		createElement(LogoClouds, {
			title,
			subtitle,
			marqueeAriaLabel,
			classNames,
			animation,
			editMode,
			// §6.2: stable targets in EVERY mode; the compiler owns CSS.
			rootAttrs: anvilRootAttrs(id),
			targetAttrs: {
				title: anvilTargetAttrs(id, "title"),
				subtitle: anvilTargetAttrs(id, "subtitle"),
				logos: anvilTargetAttrs(id, "logos"),
				logoItem: anvilTargetAttrs(id, "logoItem"),
				logoImage: anvilTargetAttrs(id, "logoImage"),
			} satisfies Record<
				Exclude<LogoCloudsTargetId, "root">,
				Record<string, string>
			>,
		});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `logo-clouds.targets.<id>` keys the
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
			label: t(`logo-clouds.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<LogoCloudsAuthorableProps> {
	return {
		label: t("logo-clouds.label"),
		defaultProps: {
			...defaultProps,
			marqueeAriaLabel: t("logo-clouds.a11y.marquee"),
		},
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderLogoClouds,
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
