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
import { BentoGrid } from "./BentoGrid";
import { bentoGridExampleItems } from "./data";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { BentoGridProps } from "./types";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type BentoGridAuthorableProps = AuthorableProps<BentoGridProps>;

export const metadata = {
	componentName: "BentoGrid",
	componentSlug: "bento-grid",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// AnvilKit visual-editor capability declaration (contract:
	// `EditorCapabilityMetadata` in `@anvilkit/contracts/editor` —
	// mirrored literally to avoid a new dependency). `styleTarget:
	// "root"`: BentoGrid spreads `editorDataAttributes` onto its root
	// section. `layoutContainer` covers the display/padding the root
	// honours; the inner card grid keeps its own gap classes, and
	// items are serialized props (no slot fields), so no `slotMap`.
	editor: {
		version: "1",
		styleTarget: "root",
		capabilities: {
			layoutContainer: true,
			visualStyle: true,
			responsive: true,
		},
	},
	// PLAN-0025 metadata v2 (§6.1/§6.5), alongside v1 until cutover.
	// Deviations, confirmed against the real DOM: the root keeps its
	// v1-era `!`-guarded theme background/border/shadow utilities, so
	// those properties are NOT granted at root (granting controls the
	// guards defeat would violate §6.5 "fewer controls is safer"); the
	// `items` grid grants them where they genuinely apply. Child cards
	// are their own DOM, not Puck nodes — parent styles must not leak
	// (§6.5), so no card-level target exists.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Grid",
					responsive: true,
					properties: [
						"width",
						"maxWidth",
						"margin",
						"padding",
						"borderRadius",
						"opacity",
					],
				},
				items: {
					label: "Items",
					responsive: true,
					properties: ["display", "gap", "padding", "background"],
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

function buildFields(t: T): Fields<BentoGridAuthorableProps> {
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
		editMode: props.editMode,
		editorDataAttributes: (props as EditorRenderProps).editorDataAttributes,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(props.id),
		targetAttrs: { items: anvilTargetAttrs(props.id, "items") },
	});

function buildConfig(t: T): ComponentConfig<BentoGridAuthorableProps> {
	return {
		label: t("bento-grid.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderBentoGrid,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<BentoGridAuthorableProps>;

export const bentoGridConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BentoGridAuthorableProps>;

export const componentConfig = bentoGridConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BentoGridAuthorableProps> {
	return buildConfig(createT(options));
}

export const createBentoGridConfig = createComponentConfig;
