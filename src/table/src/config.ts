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
import type { TableColumn, TableProps, TableRowData } from "./Table";
import { Table } from "./Table";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type TableAuthorableProps = AuthorableProps<TableProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Table.tsx:
 * the `root` scroll container, every `header` cell, every `row`, every
 * body `cell`, and the `caption`. The caption is conditional on its prop
 * — the same allowance the `card` package's title/description carry —
 * and is present under `defaultProps`.
 */
const STYLE_TARGET_IDS = ["root", "header", "row", "cell", "caption"] as const;

type TableTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Table",
	componentSlug: "table",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "display",
	// Every target here is text-bearing except `root` and `row`, which are
	// structural; typography is granted on the cells and the caption.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Table",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"maxHeight",
						"margin",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"overflow",
						"color",
						"fontFamily",
						"fontSize",
						"lineHeight",
					],
				},
				header: {
					label: "Header cell",
					responsive: true,
					properties: [
						"padding",
						"background",
						"border",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textTransform",
						"textWrap",
					],
				},
				row: {
					label: "Row",
					responsive: true,
					properties: ["background", "border", "opacity"],
				},
				cell: {
					label: "Cell",
					responsive: true,
					properties: [
						"padding",
						"background",
						"border",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textWrap",
					],
				},
				caption: {
					label: "Caption",
					responsive: true,
					properties: [
						"margin",
						"padding",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"textAlign",
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
	// DOC-01 §5.18 shows `""`; a declared style target must have a stamped
	// element in the DEFAULT DOM or the authoring-parity suite fails, so the
	// default carries copy (identical deviation to the `card` package).
	// Empty-collapse behaviour for authors is unchanged.
	caption: "Quarterly results",
	columns: [{ header: "Name" }, { header: "Role" }, { header: "Location" }],
	rows: [
		{ cells: [{ value: "Ada" }, { value: "Engineer" }, { value: "London" }] },
		{
			cells: [{ value: "Grace" }, { value: "Admiral" }, { value: "New York" }],
		},
	],
} satisfies TableProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<TableAuthorableProps> {
	return {
		...authoringFields,
		caption: {
			type: "text",
			label: t("table.fields.caption.label"),
		},
		columns: {
			type: "array",
			label: t("table.fields.columns.label"),
			defaultItemProps: { header: "Column" },
			getItemSummary: (item: TableColumn, index?: number) =>
				item.header ||
				t("table.fields.columns.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				header: { type: "text", label: t("table.fields.columns.header.label") },
			},
		},
		// Nested array-in-array: Puck's `ArrayField` subfields are the full
		// Field union, so an `array` inside an `array` is type-supported
		// (DOC-01 §5.18). Cells stay text-only in v1.
		rows: {
			type: "array",
			label: t("table.fields.rows.label"),
			defaultItemProps: { cells: [{ value: "" }] },
			getItemSummary: (_item: TableRowData, index?: number) =>
				t("table.fields.rows.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				cells: {
					type: "array",
					label: t("table.fields.rows.cells.label"),
					defaultItemProps: { value: "" },
					arrayFields: {
						value: {
							type: "text",
							label: t("table.fields.rows.cells.value.label"),
						},
					},
				},
			},
		},
		animation: animationField({
			label: t("table.fields.animation.label"),
			preset: t("table.fields.animation.preset"),
			presetOptions: {
				none: t("table.fields.animation.preset.options.none"),
				"fade-in": t("table.fields.animation.preset.options.fade-in"),
				"slide-up": t("table.fields.animation.preset.options.slide-up"),
				"slide-down": t("table.fields.animation.preset.options.slide-down"),
				"zoom-in": t("table.fields.animation.preset.options.zoom-in"),
			},
			duration: t("table.fields.animation.duration"),
			delay: t("table.fields.animation.delay"),
			easing: t("table.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`table.targets.${targetId}`),
			})),
			t("table.fields.classNames.label"),
		),
	};
}

const renderTable: ComponentConfig<TableAuthorableProps>["render"] = ({
	id,
	caption,
	columns,
	rows,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Table, {
		caption,
		columns,
		rows,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			header: anvilTargetAttrs(id, "header"),
			row: anvilTargetAttrs(id, "row"),
			cell: anvilTargetAttrs(id, "cell"),
			caption: anvilTargetAttrs(id, "caption"),
		} satisfies Record<Exclude<TableTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `table.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`table.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<TableAuthorableProps> {
	return {
		label: t("table.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderTable,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<TableAuthorableProps>;

export const tableConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<TableAuthorableProps>;

export const componentConfig = tableConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<TableAuthorableProps> {
	return buildConfig(createT(options));
}

export const createTableConfig = createComponentConfig;
