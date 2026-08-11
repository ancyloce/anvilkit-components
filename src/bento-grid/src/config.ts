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
import { BentoGrid } from "./BentoGrid";
import { bentoGridExampleItems } from "./data";
import {
	type BentoGridItemsAdapter,
	type CreateComponentConfigOptions,
	createT,
} from "./i18n";
import type { BentoGridItem, BentoGridProps } from "./types";

/**
 * Business props + the §5.1 authoring carriers (PLAN-0025), plus the
 * PLAN-0027 §2.3 data-source props. `dataSource`/`externalData` only
 * gain fields when the host injects an adapter via
 * `createComponentConfig({ dataSources })`; the static config never
 * declares them.
 */
export type BentoGridAuthorableProps = AuthorableProps<BentoGridProps> & {
	/** §2.3 data-source mode; meaningful only with a host adapter. */
	dataSource?: "static" | "external";
	/** §2.3 external-field selection, stored whole per the Puck contract. */
	externalData?: unknown;
};

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of BentoGrid.tsx
 * and its card subtree: the root `<section>` shell, the `items` card
 * grid, and — stamped on EVERY card instance — `card` (BentoCard's
 * container), `cardIcon` (IconBadge), `cardTitle`/`cardDescription`
 * (BentoCardContent's text block), and `cardCta` (ItemCallToAction's
 * `<a>` AND its disabled `<span>` branch). An empty `items` array
 * renders root + grid only — it has no cards by definition.
 */
const STYLE_TARGET_IDS = [
	"root",
	"items",
	"card",
	"cardIcon",
	"cardTitle",
	"cardDescription",
	"cardCta",
] as const;

type BentoGridTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "BentoGrid",
	componentSlug: "bento-grid",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only
	// (`cardIcon` gets `color` alone — the lucide icon renders with
	// currentColor, so it genuinely applies). Deviation, confirmed
	// against the real DOM: the root keeps its `!`-guarded theme
	// background/border/shadow utilities, so those properties are NOT
	// granted at root (granting controls the guards defeat would violate
	// §6.5 "fewer controls is safer").
	// p6-003 widening rule: `items` is the only real grid (`grid
	// auto-rows-fr` in BentoGrid.tsx), so it alone takes `columns`/`rows`;
	// `card` is a flex column and takes `direction`/`wrap`.
	// `rowGap`/`columnGap` follow every existing `gap` grant,
	// `minHeight`/`maxHeight` follow every existing `height` grant, and
	// `overflow` goes on the boxes that already clip or already grant a
	// radius. `cursor` is `cardCta` only — the one interactive element.
	// No `zIndex`: the cards abut across a 1px gap and grant neither
	// margin nor inset, so nothing here overlaps anything to raise above.
	// `cardIcon` gets no `filter`/`blendMode` — it is an icon badge, not a
	// replaced image.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Bento grid",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"borderRadius",
						"opacity",
						"minHeight",
						"maxHeight",
						"overflow",
					],
				},
				items: {
					label: "Card grid",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"margin",
						"padding",
						"background",
						"borderRadius",
						"opacity",
						"rowGap",
						"columnGap",
						"columns",
						"rows",
						"overflow",
					],
				},
				card: {
					label: "Card",
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
				cardIcon: {
					label: "Card icon",
					responsive: true,
					properties: [
						"display",
						"width",
						"height",
						"margin",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"color",
						"minHeight",
						"maxHeight",
						"overflow",
					],
				},
				cardTitle: {
					label: "Card title",
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
				cardDescription: {
					label: "Card description",
					responsive: true,
					properties: [
						"display",
						"maxWidth",
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
				cardCta: {
					label: "Card CTA",
					responsive: true,
					properties: [
						"display",
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
						"cursor",
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	items: bentoGridExampleItems,
	platform: "adaptive",
	theme: "dark",
} satisfies BentoGridProps;

type T = ReturnType<typeof createT>;

/** §2.3 fields added only when the host injects an items adapter. */
function buildDataSourceFields(
	adapter: BentoGridItemsAdapter,
	t: T,
): Pick<Fields<BentoGridAuthorableProps>, "dataSource" | "externalData"> {
	return {
		dataSource: {
			type: "select",
			label: t("bento-grid.fields.dataSource.label"),
			options: [
				{
					label: t("bento-grid.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("bento-grid.fields.dataSource.options.external"),
					value: "external",
				},
			],
		},
		externalData: {
			type: "external",
			label: t("bento-grid.fields.externalData.label"),
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
): Fields<BentoGridAuthorableProps> {
	const adapter = dataSources?.items;
	return {
		...authoringFields,
		theme: {
			type: "select",
			label: t("bento-grid.fields.theme.label"),
			options: [
				{
					label: t("bento-grid.fields.theme.options.system"),
					value: "system",
				},
				{
					label: t("bento-grid.fields.theme.options.light"),
					value: "light",
				},
				{
					label: t("bento-grid.fields.theme.options.dark"),
					value: "dark",
				},
			],
		},
		platform: {
			type: "select",
			label: t("bento-grid.fields.platform.label"),
			options: [
				{
					label: t("bento-grid.fields.platform.options.adaptive"),
					value: "adaptive",
				},
				{
					label: t("bento-grid.fields.platform.options.mobile"),
					value: "mobile",
				},
				{
					label: t("bento-grid.fields.platform.options.tablet"),
					value: "tablet",
				},
				{
					label: t("bento-grid.fields.platform.options.desktop"),
					value: "desktop",
				},
			],
		},
		items: {
			type: "array",
			label: t("bento-grid.fields.items.label"),
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
			getItemSummary: (item, index) =>
				item.title ||
				t("bento-grid.fields.items.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				icon: {
					type: "select",
					label: t("bento-grid.fields.items.icon.label"),
					options: [
						{
							label: t("bento-grid.fields.items.icon.options.brain"),
							value: "brain",
						},
						{
							label: t("bento-grid.fields.items.icon.options.users"),
							value: "users",
						},
						{
							label: t("bento-grid.fields.items.icon.options.plug"),
							value: "plug",
						},
						{
							label: t("bento-grid.fields.items.icon.options.globe"),
							value: "globe",
						},
						{
							label: t("bento-grid.fields.items.icon.options.code"),
							value: "code",
						},
						{
							label: t("bento-grid.fields.items.icon.options.zap"),
							value: "zap",
						},
					],
				},
				title: {
					type: "text",
					label: t("bento-grid.fields.items.title.label"),
				},
				description: {
					type: "textarea",
					label: t("bento-grid.fields.items.description.label"),
				},
				size: {
					type: "select",
					label: t("bento-grid.fields.items.size.label"),
					options: [
						{
							label: t("bento-grid.fields.items.size.options.default"),
							value: "default",
						},
						{
							label: t("bento-grid.fields.items.size.options.wide"),
							value: "wide",
						},
						{
							label: t("bento-grid.fields.items.size.options.tall"),
							value: "tall",
						},
					],
				},
				rounded: {
					type: "radio",
					label: t("bento-grid.fields.items.rounded.label"),
					options: [
						{
							label: t("bento-grid.fields.items.rounded.options.true"),
							value: true,
						},
						{
							label: t("bento-grid.fields.items.rounded.options.false"),
							value: false,
						},
					],
				},
				background: {
					type: "radio",
					label: t("bento-grid.fields.items.background.label"),
					options: [
						{
							label: t("bento-grid.fields.items.background.options.true"),
							value: true,
						},
						{
							label: t("bento-grid.fields.items.background.options.false"),
							value: false,
						},
					],
				},
				ctaLabel: {
					type: "text",
					label: t("bento-grid.fields.items.ctaLabel.label"),
				},
				ctaHref: {
					type: "text",
					label: t("bento-grid.fields.items.ctaHref.label"),
				},
				ctaOpenInNewTab: {
					type: "radio",
					label: t("bento-grid.fields.items.ctaOpenInNewTab.label"),
					options: [
						{
							label: t("bento-grid.fields.items.ctaOpenInNewTab.options.false"),
							value: false,
						},
						{
							label: t("bento-grid.fields.items.ctaOpenInNewTab.options.true"),
							value: true,
						},
					],
				},
			},
		},
		...(adapter ? buildDataSourceFields(adapter, t) : {}),
		animation: animationField({
			label: t("bento-grid.fields.animation.label"),
			preset: t("bento-grid.fields.animation.preset"),
			presetOptions: {
				none: t("bento-grid.fields.animation.preset.options.none"),
				"fade-in": t("bento-grid.fields.animation.preset.options.fade-in"),
				"slide-up": t("bento-grid.fields.animation.preset.options.slide-up"),
				"slide-down": t(
					"bento-grid.fields.animation.preset.options.slide-down",
				),
				"zoom-in": t("bento-grid.fields.animation.preset.options.zoom-in"),
			},
			duration: t("bento-grid.fields.animation.duration"),
			delay: t("bento-grid.fields.animation.delay"),
			easing: t("bento-grid.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`bento-grid.targets.${targetId}`),
			})),
			t("bento-grid.fields.classNames.label"),
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
	adapter: BentoGridItemsAdapter,
): NonNullable<ComponentConfig<BentoGridAuthorableProps>["resolveData"]> {
	return ({ props }, { changed }) => {
		if (!changed.dataSource && !changed.externalData) {
			return { props: {} };
		}
		if (props.dataSource !== "external") {
			return { props: {}, readOnly: { items: false } };
		}
		if (props.externalData == null) {
			// External mode with nothing selected yet: keep the authored
			// items visible but locked until a selection lands.
			return { props: {}, readOnly: { items: true } };
		}
		const selection = Array.isArray(props.externalData)
			? props.externalData
			: [props.externalData];
		const mapItem =
			adapter.mapItem ?? ((item: unknown) => item as BentoGridItem);
		return {
			props: { items: selection.map(mapItem) },
			readOnly: { items: true },
		};
	};
}

/** Editor-injected render props (present only when authoring is on). */
type EditorRenderProps = {
	editorDataAttributes?: Readonly<Record<string, string>>;
};

const renderBentoGrid: ComponentConfig<BentoGridAuthorableProps>["render"] = (
	props,
) =>
	createElement(BentoGrid, {
		items: props.items,
		platform: props.platform,
		theme: props.theme,
		classNames: props.classNames,
		animation: props.animation,
		editMode: props.editMode,
		editorDataAttributes: (props as EditorRenderProps).editorDataAttributes,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(props.id),
		targetAttrs: {
			items: anvilTargetAttrs(props.id, "items"),
			card: anvilTargetAttrs(props.id, "card"),
			cardIcon: anvilTargetAttrs(props.id, "cardIcon"),
			cardTitle: anvilTargetAttrs(props.id, "cardTitle"),
			cardDescription: anvilTargetAttrs(props.id, "cardDescription"),
			cardCta: anvilTargetAttrs(props.id, "cardCta"),
		} satisfies Record<
			Exclude<BentoGridTargetId, "root">,
			Record<string, string>
		>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `bento-grid.targets.<id>` keys the
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
			label: t(`bento-grid.targets.${targetId}`),
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
): ComponentConfig<BentoGridAuthorableProps> {
	const config: ComponentConfig<BentoGridAuthorableProps> = {
		label: t("bento-grid.label"),
		defaultProps,
		fields: buildFields(t, dataSources),
		metadata: buildMetadata(t),
		render: renderBentoGrid,
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
) satisfies Fields<BentoGridAuthorableProps>;

export const bentoGridConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BentoGridAuthorableProps>;

export const componentConfig = bentoGridConfig;

/**
 * Build a locale-aware config. Per-key fallback: messages → locale pack
 * → en. With `options.dataSources.items` present the config gains the
 * §2.3 `dataSource`/`externalData` fields and `resolveData`; without it
 * the output is byte-compatible with `componentConfig`.
 */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BentoGridAuthorableProps> {
	return buildConfig(createT(options), options?.dataSources);
}

export const createBentoGridConfig = createComponentConfig;
