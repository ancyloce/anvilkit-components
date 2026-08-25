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
import type { StackProps } from "./Stack";
import { Stack } from "./Stack";

export type StackAuthorableProps = AuthorableProps<StackProps>;
const STYLE_TARGET_IDS = ["root", "content"] as const;
type StackTargetId = (typeof STYLE_TARGET_IDS)[number];
const directionOptions = ["vertical", "horizontal"] as const;
const gapOptions = ["none", "xs", "sm", "md", "lg", "xl"] as const;
const alignmentOptions = ["stretch", "start", "center", "end"] as const;
const justificationOptions = ["start", "center", "end", "between"] as const;

export const metadata = {
	componentName: "Stack",
	componentSlug: "stack",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Stack",
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
	content: [],
	direction: "vertical",
	gap: "md",
	alignment: "stretch",
	justification: "start",
	wrap: false,
} satisfies StackProps;
type T = ReturnType<typeof createT>;
function buildFields(t: T): Fields<StackAuthorableProps> {
	return {
		...authoringFields,
		content: { type: "slot", label: t("stack.fields.content.label") },
		direction: {
			type: "select",
			label: t("stack.fields.direction.label"),
			options: directionOptions.map((value) => ({
				label: t(`stack.fields.direction.options.${value}`),
				value,
			})),
		},
		gap: {
			type: "select",
			label: t("stack.fields.gap.label"),
			options: gapOptions.map((value) => ({
				label: t(`stack.fields.gap.options.${value}`),
				value,
			})),
		},
		alignment: {
			type: "select",
			label: t("stack.fields.alignment.label"),
			options: alignmentOptions.map((value) => ({
				label: t(`stack.fields.alignment.options.${value}`),
				value,
			})),
		},
		justification: {
			type: "select",
			label: t("stack.fields.justification.label"),
			options: justificationOptions.map((value) => ({
				label: t(`stack.fields.justification.options.${value}`),
				value,
			})),
		},
		wrap: {
			type: "radio",
			label: t("stack.fields.wrap.label"),
			options: [
				{ label: t("stack.fields.wrap.options.false"), value: false },
				{ label: t("stack.fields.wrap.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("stack.fields.animation.label"),
			preset: t("stack.fields.animation.preset"),
			presetOptions: {
				none: t("stack.fields.animation.preset.options.none"),
				"fade-in": t("stack.fields.animation.preset.options.fade-in"),
				"slide-up": t("stack.fields.animation.preset.options.slide-up"),
				"slide-down": t("stack.fields.animation.preset.options.slide-down"),
				"zoom-in": t("stack.fields.animation.preset.options.zoom-in"),
			},
			duration: t("stack.fields.animation.duration"),
			delay: t("stack.fields.animation.delay"),
			easing: t("stack.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`stack.targets.${targetId}`),
			})),
			t("stack.fields.classNames.label"),
		),
	};
}
const renderStack: ComponentConfig<StackAuthorableProps>["render"] = ({
	id,
	content: Content,
	direction,
	gap,
	alignment,
	justification,
	wrap,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Stack, {
		content: createElement(Content),
		direction,
		gap,
		alignment,
		justification,
		wrap,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: { content: anvilTargetAttrs(id, "content") } satisfies Record<
			Exclude<StackTargetId, "root">,
			Record<string, string>
		>,
	});
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS)
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`stack.targets.${targetId}`),
		};
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}
function buildConfig(t: T): ComponentConfig<StackAuthorableProps> {
	return {
		label: t("stack.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderStack,
	};
}
const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<StackAuthorableProps>;
export const stackConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<StackAuthorableProps>;
export const componentConfig = stackConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<StackAuthorableProps> {
	return buildConfig(createT(options));
}
export const createStackConfig = createComponentConfig;
