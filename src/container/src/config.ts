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
import type { ContainerProps } from "./Container";
import { Container } from "./Container";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type ContainerAuthorableProps = AuthorableProps<ContainerProps>;

const STYLE_TARGET_IDS = ["root", "content"] as const;
type ContainerTargetId = (typeof STYLE_TARGET_IDS)[number];
const maxWidthOptions = ["sm", "md", "lg", "xl", "full"] as const;
const paddingOptions = ["none", "sm", "md", "lg"] as const;
const alignmentOptions = ["start", "center", "end", "stretch"] as const;

export const metadata = {
	componentName: "Container",
	componentSlug: "container",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Container",
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
						"inset",
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
	maxWidth: "lg",
	padding: "md",
	alignment: "center",
} satisfies ContainerProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<ContainerAuthorableProps> {
	return {
		...authoringFields,
		content: { type: "slot", label: t("container.fields.content.label") },
		maxWidth: {
			type: "select",
			label: t("container.fields.maxWidth.label"),
			options: maxWidthOptions.map((value) => ({
				label: t(`container.fields.maxWidth.options.${value}`),
				value,
			})),
		},
		padding: {
			type: "radio",
			label: t("container.fields.padding.label"),
			options: paddingOptions.map((value) => ({
				label: t(`container.fields.padding.options.${value}`),
				value,
			})),
		},
		alignment: {
			type: "radio",
			label: t("container.fields.alignment.label"),
			options: alignmentOptions.map((value) => ({
				label: t(`container.fields.alignment.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("container.fields.animation.label"),
			preset: t("container.fields.animation.preset"),
			presetOptions: {
				none: t("container.fields.animation.preset.options.none"),
				"fade-in": t("container.fields.animation.preset.options.fade-in"),
				"slide-up": t("container.fields.animation.preset.options.slide-up"),
				"slide-down": t("container.fields.animation.preset.options.slide-down"),
				"zoom-in": t("container.fields.animation.preset.options.zoom-in"),
			},
			duration: t("container.fields.animation.duration"),
			delay: t("container.fields.animation.delay"),
			easing: t("container.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`container.targets.${targetId}`),
			})),
			t("container.fields.classNames.label"),
		),
	};
}

const renderContainer: ComponentConfig<ContainerAuthorableProps>["render"] = ({
	id,
	content: Content,
	maxWidth,
	padding,
	alignment,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Container, {
		content: createElement(Content),
		maxWidth,
		padding,
		alignment,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			content: anvilTargetAttrs(id, "content"),
		} satisfies Record<
			Exclude<ContainerTargetId, "root">,
			Record<string, string>
		>,
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`container.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<ContainerAuthorableProps> {
	return {
		label: t("container.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderContainer,
	};
}

const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<ContainerAuthorableProps>;
export const containerConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ContainerAuthorableProps>;
export const componentConfig = containerConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ContainerAuthorableProps> {
	return buildConfig(createT(options));
}
export const createContainerConfig = createComponentConfig;
