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
import type { NavbarProps } from "./Navbar";
import { Navbar } from "./Navbar";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type NavbarAuthorableProps = AuthorableProps<NavbarProps>;

export const metadata = {
	componentName: "Navbar",
	componentSlug: "navbar",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "navigation",
	// PLAN-0025 metadata v2 (§6.1/§6.5): root nav bar; `links` and
	// `actions` stamp the desktop, mobile, AND empty-fallback containers
	// with the SAME target ids (§6.5: mobile variants retain target
	// ids). Item labels live in array rows, not plain prop paths, so no
	// inlineText declarations.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Navbar",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"background",
						"border",
						"boxShadow",
						"opacity",
					],
				},
				links: {
					label: "Links",
					responsive: true,
					properties: ["display", "gap", "padding", "justifyContent", "alignItems"],
				},
				actions: {
					label: "Actions",
					responsive: true,
					properties: ["display", "gap", "padding", "justifyContent", "alignItems"],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
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

function buildFields(t: T): Fields<NavbarAuthorableProps> {
	return {
		...authoringFields,
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

const renderNavbar: ComponentConfig<NavbarAuthorableProps>["render"] = ({
	id,
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
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			links: anvilTargetAttrs(id, "links"),
			actions: anvilTargetAttrs(id, "actions"),
		},
	});

function buildConfig(t: T): ComponentConfig<NavbarAuthorableProps> {
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

export const fields = buildFields(
	defaultT,
) satisfies Fields<NavbarAuthorableProps>;

export const navbarConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<NavbarAuthorableProps>;

export const componentConfig = navbarConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<NavbarAuthorableProps> {
	return buildConfig(createT(options));
}

export const createNavbarConfig = createComponentConfig;
