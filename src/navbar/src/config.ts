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
	type NavbarItemsAdapter,
} from "./i18n";
import type { NavbarMenuItem, NavbarProps } from "./Navbar";
import { Navbar } from "./Navbar";

/**
 * Business props + the §5.1 authoring carriers (PLAN-0025), plus the
 * PLAN-0027 §2.3 data-source props. `dataSource`/`externalData` only
 * gain fields when the host injects an adapter via
 * `createComponentConfig({ dataSources })`; the static config never
 * declares them.
 */
export type NavbarAuthorableProps = AuthorableProps<NavbarProps> & {
	/** §2.3 data-source mode; meaningful only with a host adapter. */
	dataSource?: "static" | "external";
	/** §2.3 external-field selection, stored whole per the Puck contract. */
	externalData?: unknown;
};

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Navbar.tsx:
 * `logo` stamps both logo branches (interactive `<a>` and static
 * `<div>`); `links`/`actions` stamp the desktop containers, the mobile
 * panel's lists, AND the empty §6.4 fallback containers with the SAME
 * target ids (§6.5); `menuToggle` stamps the mobile toggle wrapper. The
 * open mobile panel itself is toggle-state-gated (absent from the
 * default DOM), so it is deliberately NOT a target — its lists reuse
 * `links`/`actions` instead.
 */
const STYLE_TARGET_IDS = [
	"root",
	"logo",
	"links",
	"actions",
	"menuToggle",
] as const;

type NavbarTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Navbar",
	componentSlug: "navbar",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "navigation",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets: `links` and `actions` stamp the desktop, mobile, AND
	// empty-fallback containers with the SAME target ids (§6.5: mobile
	// variants retain target ids). Allowlists use only the grantable
	// §6.1 vocabulary; no typography grants — every text element below
	// these containers carries its own utility classes (and the desktop
	// link colors are inline highlight state), so container-level
	// typography would be silently ineffective. Item labels live in
	// array rows, not plain prop paths, so no inlineText declarations.
	// p6-003 widening rule: `root` already grants `position`, so it gains
	// `inset` — the pair that makes an offset/sticky bar authorable. It
	// deliberately does NOT gain `zIndex`, even though a sticky bar is
	// exactly where an author reaches for one: nothing in this component
	// establishes a stacking context, so the value would escape into the
	// page, which is the case ADR 0007 decision 5 re-homed here.
	// `links`/`actions`/`logo` are flex rows — the desktop links row
	// already uses `gap-x`/`gap-y`, so the axis gaps and `direction`/`wrap`
	// are the natural grants. `logo` and `menuToggle` are the click targets
	// and the only `cursor` grants. Still no typography anywhere.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Navbar",
					responsive: true,
					properties: [
						"display",
						"position",
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
						"inset",
						"overflow",
					],
				},
				logo: {
					label: "Logo",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
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
						"cursor",
					],
				},
				links: {
					label: "Links",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
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
						"overflow",
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
						"overflow",
					],
				},
				menuToggle: {
					label: "Menu toggle",
					responsive: true,
					properties: [
						"display",
						"alignItems",
						"justifyContent",
						"width",
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
						"cursor",
					],
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

/** §2.3 fields added only when the host injects an items adapter. */
function buildDataSourceFields(
	adapter: NavbarItemsAdapter,
	t: T,
): Pick<Fields<NavbarAuthorableProps>, "dataSource" | "externalData"> {
	return {
		dataSource: {
			type: "select",
			label: t("navbar.fields.dataSource.label"),
			options: [
				{
					label: t("navbar.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("navbar.fields.dataSource.options.external"),
					value: "external",
				},
			],
		},
		externalData: {
			type: "external",
			label: t("navbar.fields.externalData.label"),
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
): Fields<NavbarAuthorableProps> {
	const adapter = dataSources?.items;
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
		// §2.3: the data-source fields sit right after the collection they govern.
		...(adapter ? buildDataSourceFields(adapter, t) : {}),
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
		animation: animationField({
			label: t("navbar.fields.animation.label"),
			preset: t("navbar.fields.animation.preset"),
			presetOptions: {
				none: t("navbar.fields.animation.preset.options.none"),
				"fade-in": t("navbar.fields.animation.preset.options.fade-in"),
				"slide-up": t("navbar.fields.animation.preset.options.slide-up"),
				"slide-down": t("navbar.fields.animation.preset.options.slide-down"),
				"zoom-in": t("navbar.fields.animation.preset.options.zoom-in"),
			},
			duration: t("navbar.fields.animation.duration"),
			delay: t("navbar.fields.animation.delay"),
			easing: t("navbar.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`navbar.targets.${targetId}`),
			})),
			t("navbar.fields.classNames.label"),
		),
	};
}

/**
 * PLAN-0027 §2.3 resolveData (Puck docs hybrid pattern): reacts only to
 * `dataSource`/`externalData` changes (the docs' `changed` guard), maps
 * the stored external selection into `items` via the adapter's
 * `mapItem`, and marks the static `items` array read-only while
 * external mode is active. Exists only when a host adapter is injected.
 */
function buildResolveData(
	adapter: NavbarItemsAdapter,
): NonNullable<ComponentConfig<NavbarAuthorableProps>["resolveData"]> {
	return ({ props }, { changed }) => {
		if (!changed.dataSource && !changed.externalData) {
			return { props: {} };
		}
		if (props.dataSource !== "external") {
			return { props: {}, readOnly: { items: false } };
		}
		if (props.externalData == null) {
			// External mode with nothing selected yet: keep the authored
			// links visible but locked until a selection lands.
			return { props: {}, readOnly: { items: true } };
		}
		const selected = Array.isArray(props.externalData)
			? props.externalData
			: [props.externalData];
		const mapItem =
			adapter.mapItem ?? ((item: unknown) => item as NavbarMenuItem);
		return {
			props: { items: selected.map(mapItem) },
			readOnly: { items: true },
		};
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
	classNames,
	animation,
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
		classNames,
		animation,
		editMode,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			logo: anvilTargetAttrs(id, "logo"),
			links: anvilTargetAttrs(id, "links"),
			actions: anvilTargetAttrs(id, "actions"),
			menuToggle: anvilTargetAttrs(id, "menuToggle"),
		} satisfies Record<Exclude<NavbarTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `navbar.targets.<id>` keys the
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
			label: t(`navbar.targets.${targetId}`),
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
): ComponentConfig<NavbarAuthorableProps> {
	const config: ComponentConfig<NavbarAuthorableProps> = {
		label: t("navbar.label"),
		defaultProps: {
			...defaultProps,
			menuOpenLabel: t("navbar.a11y.openMenu"),
			menuCloseLabel: t("navbar.a11y.closeMenu"),
			navAriaLabel: t("navbar.a11y.primaryNav"),
			brandFallbackText: t("navbar.fallback.brand"),
		},
		fields: buildFields(t, dataSources),
		metadata: buildMetadata(t),
		render: renderNavbar,
	};
	const adapter = dataSources?.items;
	if (adapter) {
		config.resolveData = buildResolveData(adapter);
	}
	return config;
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<NavbarAuthorableProps>;

export const navbarConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<NavbarAuthorableProps>;

export const componentConfig = navbarConfig;

/**
 * Build a locale-aware config. Per-key fallback: messages → locale pack
 * → en. With `options.dataSources.items` present the config gains the
 * §2.3 `dataSource`/`externalData` fields and `resolveData`; without it
 * the output is byte-compatible with `componentConfig`.
 */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<NavbarAuthorableProps> {
	return buildConfig(createT(options), options?.dataSources);
}

export const createNavbarConfig = createComponentConfig;
