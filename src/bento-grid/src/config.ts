import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { BentoGridProps } from "./BentoGrid";
import { BentoGrid, bentoGridExampleItems } from "./BentoGrid";

export const metadata = {
	componentName: "BentoGrid",
	componentSlug: "bento-grid",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
} satisfies ComponentMetadata;

export const defaultProps = {
	items: bentoGridExampleItems,
	platform: "adaptive",
	theme: "dark",
} satisfies BentoGridProps;

export const fields = {
	theme: {
		type: "select",
		label: "Theme",
		options: [
			{
				label: "System",
				value: "system",
			},
			{
				label: "Light",
				value: "light",
			},
			{
				label: "Dark",
				value: "dark",
			},
		],
	},
	platform: {
		type: "select",
		label: "Platform layout",
		options: [
			{
				label: "Adaptive",
				value: "adaptive",
			},
			{
				label: "Mobile",
				value: "mobile",
			},
			{
				label: "Tablet",
				value: "tablet",
			},
			{
				label: "Desktop",
				value: "desktop",
			},
		],
	},
	items: {
		type: "array",
		label: "Cards",
		defaultItemProps: {
			icon: "brain",
			title: "Card title",
			description: "Describe the value of this card.",
			size: "default",
			rounded: false,
			background: true,
			ctaLabel: "Learn more >",
			ctaHref: "#",
			ctaOpenInNewTab: false,
		},
		getItemSummary: (item, index) => item.title || `Card ${(index ?? 0) + 1}`,
		arrayFields: {
			icon: {
				type: "select",
				label: "Icon",
				options: [
					{
						label: "Brain",
						value: "brain",
					},
					{
						label: "Users",
						value: "users",
					},
					{
						label: "Plug",
						value: "plug",
					},
					{
						label: "Globe",
						value: "globe",
					},
					{
						label: "Code",
						value: "code",
					},
					{
						label: "Zap",
						value: "zap",
					},
				],
			},
			title: {
				type: "text",
				label: "Title",
			},
			description: {
				type: "textarea",
				label: "Description",
			},
			size: {
				type: "select",
				label: "Size",
				options: [
					{
						label: "Default",
						value: "default",
					},
					{
						label: "Wide",
						value: "wide",
					},
					{
						label: "Tall",
						value: "tall",
					},
				],
			},
			rounded: {
				type: "radio",
				label: "Rounded corners",
				options: [
					{
						label: "Yes",
						value: true,
					},
					{
						label: "No",
						value: false,
					},
				],
			},
			background: {
				type: "radio",
				label: "Decorative background",
				options: [
					{
						label: "Yes",
						value: true,
					},
					{
						label: "No",
						value: false,
					},
				],
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
				label: "Open CTA in new tab",
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
		},
	},
} satisfies Fields<BentoGridProps>;

const renderBentoGrid: ComponentConfig<BentoGridProps>["render"] = ({
	items,
	platform,
	theme,
	editMode,
}) =>
	createElement(BentoGrid, {
		items,
		platform,
		theme,
		editMode,
	});

export const bentoGridConfig = {
	label: "Bento Grid",
	defaultProps,
	fields,
	metadata,
	render: renderBentoGrid,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<BentoGridProps>;

export const componentConfig = bentoGridConfig;
