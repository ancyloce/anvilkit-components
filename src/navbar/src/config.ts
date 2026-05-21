import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { NavbarProps } from "./Navbar";
import { Navbar } from "./Navbar";

export const metadata = {
	componentName: "Navbar",
	componentSlug: "navbar",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "navigation",
} satisfies ComponentMetadata;

export const defaultProps = {
	logo: {
		type: "text",
		text: "Underline",
		imageUrl: "",
		alt: "Underline",
		href: "/",
	},
	items: [
		{
			label: "Overview",
			href: "/overview",
		},
		{
			label: "Features",
			href: "/features",
		},
		{
			label: "Integrations",
			href: "/integrations",
		},
		{
			label: "Customers",
			href: "/customers",
		},
		{
			label: "Changelog",
			href: "/changelog",
		},
	],
	actions: [
		{
			label: "Sign up",
			href: "/signup",
			variant: "secondary",
			size: "lg",
			openInNewTab: false,
			disabled: false,
		},
	],
	active: "/features",
} satisfies NavbarProps;

export const fields = {
	logo: {
		type: "object",
		label: "Logo",
		objectFields: {
			type: {
				type: "radio",
				label: "Type",
				options: [
					{
						label: "Text",
						value: "text",
					},
					{
						label: "Image",
						value: "image",
					},
				],
			},
			text: {
				type: "text",
				label: "Text",
			},
			imageUrl: {
				type: "text",
				label: "Image URL",
			},
			alt: {
				type: "text",
				label: "Image alt text",
			},
			href: {
				type: "text",
				label: "Link URL",
			},
		},
	},
	items: {
		type: "array",
		label: "Navigation links",
		defaultItemProps: {
			label: "New link",
			href: "/",
		},
		getItemSummary: (item, index) => item.label || `Link ${(index ?? 0) + 1}`,
		arrayFields: {
			label: {
				type: "text",
				label: "Label",
			},
			href: {
				type: "text",
				label: "Href",
			},
		},
	},
	actions: {
		type: "array",
		label: "Actions",
		defaultItemProps: {
			label: "Action",
			href: "",
			variant: "secondary",
			size: "lg",
			openInNewTab: false,
			disabled: false,
		},
		getItemSummary: (item, index) => item.label || `Action ${(index ?? 0) + 1}`,
		arrayFields: {
			label: {
				type: "text",
				label: "Label",
			},
			href: {
				type: "text",
				label: "Href",
			},
			variant: {
				type: "select",
				label: "Variant",
				options: [
					{
						label: "Default",
						value: "default",
					},
					{
						label: "Secondary",
						value: "secondary",
					},
					{
						label: "Outline",
						value: "outline",
					},
					{
						label: "Ghost",
						value: "ghost",
					},
					{
						label: "Link",
						value: "link",
					},
					{
						label: "Destructive",
						value: "destructive",
					},
				],
			},
			size: {
				type: "select",
				label: "Size",
				options: [
					{
						label: "Small",
						value: "sm",
					},
					{
						label: "Default",
						value: "default",
					},
					{
						label: "Large",
						value: "lg",
					},
				],
			},
			openInNewTab: {
				type: "radio",
				label: "Open in new tab",
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
			disabled: {
				type: "radio",
				label: "Disabled",
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
	active: {
		type: "text",
		label: "Active link href",
	},
} satisfies Fields<NavbarProps>;

const renderNavbar: ComponentConfig<NavbarProps>["render"] = ({
	logo,
	items,
	actions,
	active,
	editMode,
}) =>
	createElement(Navbar, {
		logo,
		items,
		actions,
		active,
		editMode,
	});

export const navbarConfig = {
	label: "Navbar",
	defaultProps,
	fields,
	metadata,
	render: renderNavbar,
} satisfies ComponentConfig<NavbarProps>;

export const componentConfig = navbarConfig;
