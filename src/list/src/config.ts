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
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { ListItem, ListProps } from "./List";
import { List } from "./List";

export type ListAuthorableProps = AuthorableProps<ListProps>;

const STYLE_TARGET_IDS = ["root", "item"] as const;

type ListTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "List",
	componentSlug: "list",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "typography",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "List",
					responsive: true,
					properties: [
						"display",
						"gap",
						"width",
						"minWidth",
						"maxWidth",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"rowGap",
					],
				},
				item: {
					label: "List item",
					responsive: true,
					properties: [
						"display",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
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
			},
			// Item copy lives inside an array row, so it is not a stable plain prop path.
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	items: [
		{ text: "Compose pages from focused components" },
		{ text: "Edit content with structured fields" },
		{ text: "Publish the same component tree everywhere" },
	],
	style: "unordered",
	spacing: "comfortable",
} satisfies ListProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<ListAuthorableProps> {
	return {
		...authoringFields,
		items: {
			type: "array",
			label: t("list.fields.items.label"),
			defaultItemProps: { text: "New item" },
			getItemSummary: (item: ListItem, index?: number) =>
				item.text ||
				t("list.fields.items.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				text: {
					type: "text",
					label: t("list.fields.items.text.label"),
				},
			},
		},
		style: {
			type: "radio",
			label: t("list.fields.style.label"),
			options: [
				{
					label: t("list.fields.style.options.unordered"),
					value: "unordered",
				},
				{
					label: t("list.fields.style.options.ordered"),
					value: "ordered",
				},
			],
		},
		spacing: {
			type: "radio",
			label: t("list.fields.spacing.label"),
			options: [
				{
					label: t("list.fields.spacing.options.compact"),
					value: "compact",
				},
				{
					label: t("list.fields.spacing.options.comfortable"),
					value: "comfortable",
				},
			],
		},
		animation: animationField({
			label: t("list.fields.animation.label"),
			preset: t("list.fields.animation.preset"),
			presetOptions: {
				none: t("list.fields.animation.preset.options.none"),
				"fade-in": t("list.fields.animation.preset.options.fade-in"),
				"slide-up": t("list.fields.animation.preset.options.slide-up"),
				"slide-down": t("list.fields.animation.preset.options.slide-down"),
				"zoom-in": t("list.fields.animation.preset.options.zoom-in"),
			},
			duration: t("list.fields.animation.duration"),
			delay: t("list.fields.animation.delay"),
			easing: t("list.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`list.targets.${targetId}`),
			})),
			t("list.fields.classNames.label"),
		),
	};
}

const renderList: ComponentConfig<ListAuthorableProps>["render"] = ({
	id,
	items,
	style,
	spacing,
	classNames,
	animation,
	editMode,
}) =>
	createElement(List, {
		items,
		style,
		spacing,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			item: anvilTargetAttrs(id, "item"),
		} satisfies Record<Exclude<ListTargetId, "root">, Record<string, string>>,
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`list.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<ListAuthorableProps> {
	return {
		label: t("list.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderList,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<ListAuthorableProps>;
export const listConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ListAuthorableProps>;
export const componentConfig = listConfig;

export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ListAuthorableProps> {
	return buildConfig(createT(options));
}

export const createListConfig = createComponentConfig;
