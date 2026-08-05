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
import type { PricingMinimalProps } from "./PricingMinimal";
import { PricingMinimal } from "./PricingMinimal";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type PricingMinimalAuthorableProps = AuthorableProps<PricingMinimalProps>;

export const metadata = {
	componentName: "PricingMinimal",
	componentSlug: "pricing-minimal",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5): plan cards are object-field
	// rows, not Puck nodes, so only the collection target (`plans`) is
	// styleable — exactly the §6.5 note for this component.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Pricing",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"background",
						"opacity",
					],
				},
				plans: {
					label: "Plans",
					responsive: true,
					properties: ["display", "gap", "margin", "padding"],
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

function buildFields(t: T): Fields<PricingMinimalAuthorableProps> {
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
	};
}

const renderPricingMinimal: ComponentConfig<
	PricingMinimalAuthorableProps
>["render"] = ({
	id,
	headline,
	description,
	plans,
	editMode,
}) =>
	createElement(PricingMinimal, {
		headline,
		description,
		plans,
		editMode,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: { plans: anvilTargetAttrs(id, "plans") },
	});

function buildConfig(t: T): ComponentConfig<PricingMinimalAuthorableProps> {
	return {
		label: t("pricing-minimal.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderPricingMinimal,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<PricingMinimalProps>;

export const pricingMinimalConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<PricingMinimalAuthorableProps>;

export const componentConfig = pricingMinimalConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<PricingMinimalAuthorableProps> {
	return buildConfig(createT(options));
}

export const createPricingMinimalConfig = createComponentConfig;
