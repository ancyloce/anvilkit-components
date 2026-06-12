import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { type CreateComponentConfigOptions, createT } from "./i18n";
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

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<NavbarProps> {
	return {
		logo: {
			type: "object",
			label: t("navbar.fields.logo.label"),
			objectFields: {
				type: {
					type: "radio",
					label: t("navbar.fields.logo.type.label"),
					options: [
						{
							label: t("navbar.fields.logo.type.options.text"),
							value: "text",
						},
						{
							label: t("navbar.fields.logo.type.options.image"),
							value: "image",
						},
					],
				},
				text: {
					type: "text",
					label: t("navbar.fields.logo.text.label"),
				},
				imageUrl: {
					type: "text",
					label: t("navbar.fields.logo.imageUrl.label"),
				},
				alt: {
					type: "text",
					label: t("navbar.fields.logo.alt.label"),
				},
				href: {
					type: "text",
					label: t("navbar.fields.logo.href.label"),
				},
			},
		},
		items: {
			type: "array",
			label: t("navbar.fields.items.label"),
			defaultItemProps: {
				label: "New link",
				href: "/",
			},
			getItemSummary: (item, index) =>
				item.label ||
				t("navbar.fields.items.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				label: {
					type: "text",
					label: t("navbar.fields.items.label.label"),
				},
				href: {
					type: "text",
					label: t("navbar.fields.items.href.label"),
				},
			},
		},
		actions: {
			type: "array",
			label: t("navbar.fields.actions.label"),
			defaultItemProps: {
				label: "Action",
				href: "",
				variant: "secondary",
				size: "lg",
				openInNewTab: false,
				disabled: false,
			},
			getItemSummary: (item, index) =>
				item.label ||
				t("navbar.fields.actions.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				label: {
					type: "text",
					label: t("navbar.fields.actions.label.label"),
				},
				href: {
					type: "text",
					label: t("navbar.fields.actions.href.label"),
				},
				variant: {
					type: "select",
					label: t("navbar.fields.actions.variant.label"),
					options: [
						{
							label: t("navbar.fields.actions.variant.options.default"),
							value: "default",
						},
						{
							label: t("navbar.fields.actions.variant.options.secondary"),
							value: "secondary",
						},
						{
							label: t("navbar.fields.actions.variant.options.outline"),
							value: "outline",
						},
						{
							label: t("navbar.fields.actions.variant.options.ghost"),
							value: "ghost",
						},
						{
							label: t("navbar.fields.actions.variant.options.link"),
							value: "link",
						},
						{
							label: t("navbar.fields.actions.variant.options.destructive"),
							value: "destructive",
						},
					],
				},
				size: {
					type: "select",
					label: t("navbar.fields.actions.size.label"),
					options: [
						{
							label: t("navbar.fields.actions.size.options.sm"),
							value: "sm",
						},
						{
							label: t("navbar.fields.actions.size.options.default"),
							value: "default",
						},
						{
							label: t("navbar.fields.actions.size.options.lg"),
							value: "lg",
						},
					],
				},
				openInNewTab: {
					type: "radio",
					label: t("navbar.fields.actions.openInNewTab.label"),
					options: [
						{
							label: t("navbar.fields.actions.openInNewTab.options.false"),
							value: false,
						},
						{
							label: t("navbar.fields.actions.openInNewTab.options.true"),
							value: true,
						},
					],
				},
				disabled: {
					type: "radio",
					label: t("navbar.fields.actions.disabled.label"),
					options: [
						{
							label: t("navbar.fields.actions.disabled.options.false"),
							value: false,
						},
						{
							label: t("navbar.fields.actions.disabled.options.true"),
							value: true,
						},
					],
				},
			},
		},
		active: {
			type: "text",
			label: t("navbar.fields.active.label"),
		},
	};
}

const renderNavbar: ComponentConfig<NavbarProps>["render"] = ({
	logo,
	items,
	actions,
	active,
	menuOpenLabel,
	menuCloseLabel,
	navAriaLabel,
	brandFallbackText,
	editMode,
}) =>
	createElement(Navbar, {
		logo,
		items,
		actions,
		active,
		menuOpenLabel,
		menuCloseLabel,
		navAriaLabel,
		brandFallbackText,
		editMode,
	});

function buildConfig(t: T): ComponentConfig<NavbarProps> {
	return {
		label: t("navbar.label"),
		defaultProps: {
			...defaultProps,
			menuOpenLabel: t("navbar.a11y.openMenu"),
			menuCloseLabel: t("navbar.a11y.closeMenu"),
			navAriaLabel: t("navbar.a11y.primaryNav"),
			brandFallbackText: t("navbar.fallback.brand"),
		},
		fields: buildFields(t),
		metadata,
		render: renderNavbar,
	};
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<NavbarProps>;

export const navbarConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<NavbarProps>;

export const componentConfig = navbarConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<NavbarProps> {
	return buildConfig(createT(options));
}

export const createNavbarConfig = createComponentConfig;
