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
import type { GridProps } from "./Grid";
import { Grid } from "./Grid";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type GridAuthorableProps = AuthorableProps<GridProps>;
const STYLE_TARGET_IDS = ["root", "content"] as const;
type GridTargetId = (typeof STYLE_TARGET_IDS)[number];
const columnOptions = ["1", "2", "3", "4", "auto"] as const;
const gapOptions = ["none", "xs", "sm", "md", "lg", "xl"] as const;
const alignmentOptions = ["stretch", "start", "center", "end"] as const;

export const metadata = {
	componentName: "Grid",
	componentSlug: "grid",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Grid",
					responsive: true,
					properties: [
						"display",
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
						"overflow",
					],
				},
				content: {
					label: "Content",
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
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;
export const defaultProps = {
	content: [],
	columns: "3",
	gap: "md",
	alignment: "stretch",
} satisfies GridProps;
type T = ReturnType<typeof createT>;
function buildFields(t: T): Fields<GridAuthorableProps> {
	return {
		...authoringFields,
		content: { type: "slot", label: t("grid.fields.content.label") },
		columns: {
			type: "select",
			label: t("grid.fields.columns.label"),
			options: columnOptions.map((value) => ({
				label: t(`grid.fields.columns.options.${value}`),
				value,
			})),
		},
		gap: {
			type: "select",
			label: t("grid.fields.gap.label"),
			options: gapOptions.map((value) => ({
				label: t(`grid.fields.gap.options.${value}`),
				value,
			})),
		},
		alignment: {
			type: "radio",
			label: t("grid.fields.alignment.label"),
			options: alignmentOptions.map((value) => ({
				label: t(`grid.fields.alignment.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("grid.fields.animation.label"),
			preset: t("grid.fields.animation.preset"),
			presetOptions: {
				none: t("grid.fields.animation.preset.options.none"),
				"fade-in": t("grid.fields.animation.preset.options.fade-in"),
				"slide-up": t("grid.fields.animation.preset.options.slide-up"),
				"slide-down": t("grid.fields.animation.preset.options.slide-down"),
				"zoom-in": t("grid.fields.animation.preset.options.zoom-in"),
			},
			duration: t("grid.fields.animation.duration"),
			delay: t("grid.fields.animation.delay"),
			easing: t("grid.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`grid.targets.${targetId}`),
			})),
			t("grid.fields.classNames.label"),
		),
	};
}
const renderGrid: ComponentConfig<GridAuthorableProps>["render"] = ({
	id,
	content: Content,
	columns,
	gap,
	alignment,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Grid, {
		content: createElement(Content),
		columns,
		gap,
		alignment,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: { content: anvilTargetAttrs(id, "content") } satisfies Record<
			Exclude<GridTargetId, "root">,
			Record<string, string>
		>,
	});
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS)
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`grid.targets.${targetId}`),
		};
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}
function buildConfig(t: T): ComponentConfig<GridAuthorableProps> {
	return {
		label: t("grid.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderGrid,
	};
}
const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<GridAuthorableProps>;
export const gridConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<GridAuthorableProps>;
export const componentConfig = gridConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<GridAuthorableProps> {
	return buildConfig(createT(options));
}
export const createGridConfig = createComponentConfig;
