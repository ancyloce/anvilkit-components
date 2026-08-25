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
import type { ColumnItem, ColumnsProps } from "./Columns";
import { Columns } from "./Columns";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type ColumnsAuthorableProps = AuthorableProps<ColumnsProps>;
const STYLE_TARGET_IDS = ["root", "column"] as const;
type ColumnsTargetId = (typeof STYLE_TARGET_IDS)[number];
const gapOptions = ["none", "sm", "md", "lg"] as const;
const collapseOptions = ["never", "sm", "md", "lg"] as const;
const alignmentOptions = ["stretch", "start", "center", "end"] as const;

export const metadata = {
	componentName: "Columns",
	componentSlug: "columns",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Columns",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"rowGap",
						"columnGap",
						"columns",
						"rows",
						"minHeight",
						"maxHeight",
						"overflow",
					],
				},
				column: {
					label: "Column",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
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
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	columns: [
		{ label: "Column 1", content: [] },
		{ label: "Column 2", content: [] },
	],
	gap: "md",
	collapseAt: "md",
	alignment: "stretch",
} satisfies ColumnsProps;
type T = ReturnType<typeof createT>;
function buildFields(t: T): Fields<ColumnsAuthorableProps> {
	return {
		...authoringFields,
		columns: {
			type: "array",
			label: t("columns.fields.columns.label"),
			min: 2,
			max: 4,
			defaultItemProps: (index) => ({
				label: `Column ${index + 1}`,
				content: [],
			}),
			getItemSummary: (item: ColumnItem, index?: number) =>
				item.label ||
				t("columns.fields.columns.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				label: {
					type: "text",
					label: t("columns.fields.columns.labelField.label"),
				},
				content: {
					type: "slot",
					label: t("columns.fields.columns.content.label"),
				},
			},
		},
		gap: {
			type: "select",
			label: t("columns.fields.gap.label"),
			options: gapOptions.map((value) => ({
				label: t(`columns.fields.gap.options.${value}`),
				value,
			})),
		},
		collapseAt: {
			type: "select",
			label: t("columns.fields.collapseAt.label"),
			options: collapseOptions.map((value) => ({
				label: t(`columns.fields.collapseAt.options.${value}`),
				value,
			})),
		},
		alignment: {
			type: "radio",
			label: t("columns.fields.alignment.label"),
			options: alignmentOptions.map((value) => ({
				label: t(`columns.fields.alignment.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("columns.fields.animation.label"),
			preset: t("columns.fields.animation.preset"),
			presetOptions: {
				none: t("columns.fields.animation.preset.options.none"),
				"fade-in": t("columns.fields.animation.preset.options.fade-in"),
				"slide-up": t("columns.fields.animation.preset.options.slide-up"),
				"slide-down": t("columns.fields.animation.preset.options.slide-down"),
				"zoom-in": t("columns.fields.animation.preset.options.zoom-in"),
			},
			duration: t("columns.fields.animation.duration"),
			delay: t("columns.fields.animation.delay"),
			easing: t("columns.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`columns.targets.${targetId}`),
			})),
			t("columns.fields.classNames.label"),
		),
	};
}
const renderColumns: ComponentConfig<ColumnsAuthorableProps>["render"] = ({
	id,
	columns,
	gap,
	collapseAt,
	alignment,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Columns, {
		columns: columns.map((column) => ({
			label: column.label,
			content: createElement(column.content),
		})),
		gap,
		collapseAt,
		alignment,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: { column: anvilTargetAttrs(id, "column") } satisfies Record<
			Exclude<ColumnsTargetId, "root">,
			Record<string, string>
		>,
	});
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS)
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`columns.targets.${targetId}`),
		};
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}
function buildConfig(t: T): ComponentConfig<ColumnsAuthorableProps> {
	return {
		label: t("columns.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderColumns,
	};
}
const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<ColumnsAuthorableProps>;
export const columnsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ColumnsAuthorableProps>;
export const componentConfig = columnsConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ColumnsAuthorableProps> {
	return buildConfig(createT(options));
}
export const createColumnsConfig = createComponentConfig;
