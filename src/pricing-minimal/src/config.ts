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
import {
	type CreateComponentConfigOptions,
	createT,
	type PricingMinimalPlansAdapter,
} from "./i18n";
import type { PricingMinimalProps, PricingPlan } from "./PricingMinimal";
import { PricingMinimal } from "./PricingMinimal";

/**
 * Business props + the §5.1 authoring carriers (PLAN-0025), plus the
 * PLAN-0027 §2.3 data-source props. `dataSource`/`externalData` only
 * gain fields when the host injects an adapter via
 * `createComponentConfig({ dataSources })`; the static config never
 * declares them.
 */
export type PricingMinimalAuthorableProps =
	AuthorableProps<PricingMinimalProps> & {
		/** §2.3 data-source mode; meaningful only with a host adapter. */
		dataSource?: "static" | "external";
		/** §2.3 external-field selection, stored whole per the Puck contract. */
		externalData?: unknown;
	};

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of
 * PricingMinimal.tsx: the root `<section>` wraps the intro `headline`
 * (`<h2>`) and `description` (`<p>`) plus the `plans` grid (a stable
 * container even with zero plans, §6.4). Every plan instance stamps
 * `card` on its `<article>`, `price` on the price `<span>`, `features`
 * on each feature `<ul>` (base and extra lists share the one id — the
 * compiler's exact-pair selector styles them uniformly), and `cta` on
 * the plan button in BOTH branches (interactive `<a>` render and the
 * disabled `<button>`).
 */
const STYLE_TARGET_IDS = [
	"root",
	"headline",
	"description",
	"plans",
	"card",
	"price",
	"features",
	"cta",
] as const;

type PricingMinimalTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "PricingMinimal",
	componentSlug: "pricing-minimal",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only.
	// p6-003 widening rule: `plans` is the grid (`grid grid-cols-1 …
	// lg:grid-cols-3`), so it alone takes `columns`/`rows`; `card` is the
	// flex column inside it and takes `direction`/`wrap`. `features` is a
	// <ul> that already grants `gap`, so it takes the axis gaps and nothing
	// else. `cta` is the only interactive target. No `zIndex`: `card` is
	// `position: relative`, but no ancestor inside the component isolates,
	// so the stacking would escape.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Pricing",
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
				plans: {
					label: "Plans",
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
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"rowGap",
						"columnGap",
						"columns",
						"rows",
						"overflow",
					],
				},
				card: {
					label: "Plan card",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"height",
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
				price: {
					label: "Price",
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
				features: {
					label: "Feature list",
					responsive: true,
					properties: [
						"display",
						"gap",
						"margin",
						"padding",
						"opacity",
						"rowGap",
						"columnGap",
					],
				},
				cta: {
					label: "CTA button",
					responsive: true,
					properties: [
						"display",
						"width",
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
						"textAlign",
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
	headline: "Simple, Transparent Pricing",
	description:
		"Choose a plan that works best for you and your team. No hidden fees.",
	plans: [
		{
			name: "Basic",
			description: "Perfect for side projects and small teams",
			price: "$9",
			billingPeriodLabel: "per month",
			ctaLabel: "Get Started",
			ctaHref: "/signup/basic",
			ctaOpenInNewTab: false,
			featured: false,
			badgeLabel: "",
			features: [
				{ label: "5 Projects" },
				{ label: "10GB Storage" },
				{ label: "Basic Analytics" },
				{ label: "Email Support" },
				{ label: "API Access" },
			],
			extraFeatures: [],
		},
		{
			name: "Pro",
			description: "For growing teams that need more power",
			price: "$29",
			billingPeriodLabel: "per month",
			ctaLabel: "Get Started",
			ctaHref: "/signup/pro",
			ctaOpenInNewTab: false,
			featured: true,
			badgeLabel: "Popular",
			features: [
				{ label: "Unlimited Projects" },
				{ label: "100GB Storage" },
				{ label: "Advanced Analytics" },
				{ label: "Priority Support" },
				{ label: "API Access" },
			],
			extraFeatures: [
				{ label: "Custom Integrations" },
				{ label: "Team Collaboration" },
				{ label: "Advanced Security" },
			],
		},
		{
			name: "Business",
			description: "For organizations that need full control",
			price: "$99",
			billingPeriodLabel: "per month",
			ctaLabel: "Get Started",
			ctaHref: "/signup/business",
			ctaOpenInNewTab: false,
			featured: false,
			badgeLabel: "",
			features: [
				{ label: "Unlimited Projects" },
				{ label: "Unlimited Storage" },
				{ label: "Custom Analytics" },
				{ label: "24/7 Phone Support" },
				{ label: "Dedicated Account Manager" },
			],
			extraFeatures: [
				{ label: "SSO & SAML" },
				{ label: "Audit Logs" },
				{ label: "SLA Guarantee" },
			],
		},
	],
} satisfies PricingMinimalProps;

type T = ReturnType<typeof createT>;

/** §2.3 fields added only when the host injects a plans adapter. */
function buildDataSourceFields(
	adapter: PricingMinimalPlansAdapter,
	t: T,
): Pick<Fields<PricingMinimalAuthorableProps>, "dataSource" | "externalData"> {
	return {
		dataSource: {
			type: "select",
			label: t("pricing-minimal.fields.dataSource.label"),
			options: [
				{
					label: t("pricing-minimal.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("pricing-minimal.fields.dataSource.options.external"),
					value: "external",
				},
			],
		},
		externalData: {
			type: "external",
			label: t("pricing-minimal.fields.externalData.label"),
			// The adapter deliberately takes no query params; the field
			// stores the selection whole and resolveData maps it (§2.3).
			fetchList: () => adapter.fetchList(),
			showSearch: adapter.showSearch,
			...(adapter.getItemSummary
				? { getItemSummary: adapter.getItemSummary }
				: {}),
		},
	};
}

function buildFields(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): Fields<PricingMinimalAuthorableProps> {
	const adapter = dataSources?.plans;
	return {
		...authoringFields,
		headline: {
			type: "text",
			label: t("pricing-minimal.fields.headline.label"),
		},
		description: {
			type: "textarea",
			label: t("pricing-minimal.fields.description.label"),
		},
		plans: {
			type: "array",
			label: t("pricing-minimal.fields.plans.label"),
			defaultItemProps: {
				name: "New plan",
				description: "Describe who this plan is for.",
				price: "$0",
				billingPeriodLabel: "per month",
				ctaLabel: "Get Started",
				ctaHref: "",
				ctaOpenInNewTab: false,
				featured: false,
				badgeLabel: "",
				features: [{ label: "Feature" }],
				extraFeatures: [],
			},
			getItemSummary: (item, index) =>
				item.name ||
				t("pricing-minimal.fields.plans.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				name: {
					type: "text",
					label: t("pricing-minimal.fields.plans.name.label"),
				},
				description: {
					type: "textarea",
					label: t("pricing-minimal.fields.plans.description.label"),
				},
				price: {
					type: "text",
					label: t("pricing-minimal.fields.plans.price.label"),
				},
				billingPeriodLabel: {
					type: "text",
					label: t("pricing-minimal.fields.plans.billingPeriodLabel.label"),
				},
				ctaLabel: {
					type: "text",
					label: t("pricing-minimal.fields.plans.ctaLabel.label"),
				},
				ctaHref: {
					type: "text",
					label: t("pricing-minimal.fields.plans.ctaHref.label"),
				},
				ctaOpenInNewTab: {
					type: "radio",
					label: t("pricing-minimal.fields.plans.ctaOpenInNewTab.label"),
					options: [
						{
							label: t(
								"pricing-minimal.fields.plans.ctaOpenInNewTab.options.false",
							),
							value: false,
						},
						{
							label: t(
								"pricing-minimal.fields.plans.ctaOpenInNewTab.options.true",
							),
							value: true,
						},
					],
				},
				featured: {
					type: "radio",
					label: t("pricing-minimal.fields.plans.featured.label"),
					options: [
						{
							label: t("pricing-minimal.fields.plans.featured.options.false"),
							value: false,
						},
						{
							label: t("pricing-minimal.fields.plans.featured.options.true"),
							value: true,
						},
					],
				},
				badgeLabel: {
					type: "text",
					label: t("pricing-minimal.fields.plans.badgeLabel.label"),
				},
				features: {
					type: "array",
					label: t("pricing-minimal.fields.plans.features.label"),
					defaultItemProps: {
						label: "Feature",
					},
					getItemSummary: (item, index) =>
						item.label ||
						t("pricing-minimal.fields.plans.features.itemSummary").replace(
							"{index}",
							String((index ?? 0) + 1),
						),
					arrayFields: {
						label: {
							type: "text",
							label: t("pricing-minimal.fields.plans.features.label.label"),
						},
					},
				},
				extraFeatures: {
					type: "array",
					label: t("pricing-minimal.fields.plans.extraFeatures.label"),
					defaultItemProps: {
						label: "Extra feature",
					},
					getItemSummary: (item, index) =>
						item.label ||
						t("pricing-minimal.fields.plans.extraFeatures.itemSummary").replace(
							"{index}",
							String((index ?? 0) + 1),
						),
					arrayFields: {
						label: {
							type: "text",
							label: t(
								"pricing-minimal.fields.plans.extraFeatures.label.label",
							),
						},
					},
				},
			},
		},
		...(adapter ? buildDataSourceFields(adapter, t) : {}),
		animation: animationField({
			label: t("pricing-minimal.fields.animation.label"),
			preset: t("pricing-minimal.fields.animation.preset"),
			presetOptions: {
				none: t("pricing-minimal.fields.animation.preset.options.none"),
				"fade-in": t("pricing-minimal.fields.animation.preset.options.fade-in"),
				"slide-up": t(
					"pricing-minimal.fields.animation.preset.options.slide-up",
				),
				"slide-down": t(
					"pricing-minimal.fields.animation.preset.options.slide-down",
				),
				"zoom-in": t("pricing-minimal.fields.animation.preset.options.zoom-in"),
			},
			duration: t("pricing-minimal.fields.animation.duration"),
			delay: t("pricing-minimal.fields.animation.delay"),
			easing: t("pricing-minimal.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`pricing-minimal.targets.${targetId}`),
			})),
			t("pricing-minimal.fields.classNames.label"),
		),
	};
}

/**
 * PLAN-0027 §2.3 resolveData (Puck docs hybrid pattern): reacts only to
 * `dataSource`/`externalData` changes (the docs' `changed` guard), maps
 * the stored external selection into `plans` via the adapter's
 * `mapItem`, and marks the static `plans` array read-only while
 * external mode is active. Exists only when a host adapter is injected.
 */
function buildResolveData(
	adapter: PricingMinimalPlansAdapter,
): NonNullable<ComponentConfig<PricingMinimalAuthorableProps>["resolveData"]> {
	return ({ props }, { changed }) => {
		if (!changed.dataSource && !changed.externalData) {
			return { props: {} };
		}
		if (props.dataSource !== "external") {
			return { props: {}, readOnly: { plans: false } };
		}
		if (props.externalData == null) {
			// External mode with nothing selected yet: keep the authored
			// plans visible but locked until a selection lands.
			return { props: {}, readOnly: { plans: true } };
		}
		const items = Array.isArray(props.externalData)
			? props.externalData
			: [props.externalData];
		const mapItem = adapter.mapItem ?? ((item: unknown) => item as PricingPlan);
		return {
			props: { plans: items.map(mapItem) },
			readOnly: { plans: true },
		};
	};
}

const renderPricingMinimal: ComponentConfig<PricingMinimalAuthorableProps>["render"] =
	({ id, headline, description, plans, classNames, animation, editMode }) =>
		createElement(PricingMinimal, {
			headline,
			description,
			plans,
			classNames,
			animation,
			editMode,
			// §6.2: stable targets in EVERY mode; the compiler owns CSS.
			rootAttrs: anvilRootAttrs(id),
			targetAttrs: {
				headline: anvilTargetAttrs(id, "headline"),
				description: anvilTargetAttrs(id, "description"),
				plans: anvilTargetAttrs(id, "plans"),
				card: anvilTargetAttrs(id, "card"),
				price: anvilTargetAttrs(id, "price"),
				features: anvilTargetAttrs(id, "features"),
				cta: anvilTargetAttrs(id, "cta"),
			} satisfies Record<
				Exclude<PricingMinimalTargetId, "root">,
				Record<string, string>
			>,
		});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `pricing-minimal.targets.<id>` keys
 * the `classNames` field already consumes. Target **ids** are the data
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
			label: t(`pricing-minimal.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): ComponentConfig<PricingMinimalAuthorableProps> {
	const config: ComponentConfig<PricingMinimalAuthorableProps> = {
		label: t("pricing-minimal.label"),
		defaultProps,
		fields: buildFields(t, dataSources),
		metadata: buildMetadata(t),
		render: renderPricingMinimal,
	};
	const adapter = dataSources?.plans;
	if (adapter) {
		config.resolveData = buildResolveData(adapter);
	}
	return config;
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<PricingMinimalAuthorableProps>;

export const pricingMinimalConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<PricingMinimalAuthorableProps>;

export const componentConfig = pricingMinimalConfig;

/**
 * Build a locale-aware config. Per-key fallback: messages → locale pack
 * → en. With `options.dataSources.plans` present the config gains the
 * §2.3 `dataSource`/`externalData` fields and `resolveData`; without it
 * the output is byte-compatible with `componentConfig`.
 */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<PricingMinimalAuthorableProps> {
	return buildConfig(createT(options), options?.dataSources);
}

export const createPricingMinimalConfig = createComponentConfig;
