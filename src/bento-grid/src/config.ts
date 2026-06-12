import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { BentoGridProps } from "./BentoGrid";
import { BentoGrid, bentoGridExampleItems } from "./BentoGrid";
import { type CreateComponentConfigOptions, createT } from "./i18n";

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

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<BentoGridProps> {
	return {
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

function buildConfig(t: T): ComponentConfig<BentoGridProps> {
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

export const fields = buildFields(defaultT) satisfies Fields<BentoGridProps>;

export const bentoGridConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BentoGridProps>;

export const componentConfig = bentoGridConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BentoGridProps> {
	return buildConfig(createT(options));
}

export const createBentoGridConfig = createComponentConfig;
