import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { PricingMinimalProps } from "./PricingMinimal";
import { PricingMinimal } from "./PricingMinimal";

export const metadata = {
	componentName: "PricingMinimal",
	componentSlug: "pricing-minimal",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
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

export const fields = {
	headline: {
		type: "text",
		label: "Headline",
	},
	description: {
		type: "textarea",
		label: "Description",
	},
	plans: {
		type: "array",
		label: "Plans",
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
		getItemSummary: (item, index) => item.name || `Plan ${(index ?? 0) + 1}`,
		arrayFields: {
			name: {
				type: "text",
				label: "Name",
			},
			description: {
				type: "textarea",
				label: "Description",
			},
			price: {
				type: "text",
				label: "Price",
			},
			billingPeriodLabel: {
				type: "text",
				label: "Billing period label",
			},
			ctaLabel: {
				type: "text",
				label: "CTA label",
			},
			ctaHref: {
				type: "text",
				label: "CTA href",
			},
			ctaOpenInNewTab: {
				type: "radio",
				label: "CTA opens in new tab",
				options: [
					{
						label: "No",
						value: false,
					},
					{
						label: "Yes",
						value: true,
					},
				],
			},
			featured: {
				type: "radio",
				label: "Featured plan",
				options: [
					{
						label: "No",
						value: false,
					},
					{
						label: "Yes",
						value: true,
					},
				],
			},
			badgeLabel: {
				type: "text",
				label: "Badge label",
			},
			features: {
				type: "array",
				label: "Features",
				defaultItemProps: {
					label: "Feature",
				},
				getItemSummary: (item, index) =>
					item.label || `Feature ${(index ?? 0) + 1}`,
				arrayFields: {
					label: {
						type: "text",
						label: "Feature label",
					},
				},
			},
			extraFeatures: {
				type: "array",
				label: "Extra features",
				defaultItemProps: {
					label: "Extra feature",
				},
				getItemSummary: (item, index) =>
					item.label || `Extra feature ${(index ?? 0) + 1}`,
				arrayFields: {
					label: {
						type: "text",
						label: "Feature label",
					},
				},
			},
		},
	},
} satisfies Fields<PricingMinimalProps>;

const renderPricingMinimal: ComponentConfig<PricingMinimalProps>["render"] = ({
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
	});

export const pricingMinimalConfig = {
	label: "Pricing Minimal",
	defaultProps,
	fields,
	metadata,
	render: renderPricingMinimal,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<PricingMinimalProps>;

export const componentConfig = pricingMinimalConfig;
