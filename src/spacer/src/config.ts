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
	authoringFields,
	classNamesField,
} from "./authoring";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { SpacerProps } from "./Spacer";
import { Spacer } from "./Spacer";

export type SpacerAuthorableProps = AuthorableProps<SpacerProps>;

const STYLE_TARGET_IDS = ["root"] as const;
const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

export const metadata = {
	componentName: "Spacer",
	componentSlug: "spacer",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Spacer",
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
						"opacity",
						"minHeight",
						"maxHeight",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = { size: "md" } satisfies SpacerProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SpacerAuthorableProps> {
	return {
		...authoringFields,
		size: {
			type: "radio",
			label: t("spacer.fields.size.label"),
			options: sizeOptions.map((value) => ({
				label: t(`spacer.fields.size.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("spacer.fields.animation.label"),
			preset: t("spacer.fields.animation.preset"),
			presetOptions: {
				none: t("spacer.fields.animation.preset.options.none"),
				"fade-in": t("spacer.fields.animation.preset.options.fade-in"),
				"slide-up": t("spacer.fields.animation.preset.options.slide-up"),
				"slide-down": t("spacer.fields.animation.preset.options.slide-down"),
				"zoom-in": t("spacer.fields.animation.preset.options.zoom-in"),
			},
			duration: t("spacer.fields.animation.duration"),
			delay: t("spacer.fields.animation.delay"),
			easing: t("spacer.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`spacer.targets.${targetId}`),
			})),
			t("spacer.fields.classNames.label"),
		),
	};
}

const renderSpacer: ComponentConfig<SpacerAuthorableProps>["render"] = ({
	id,
	size,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Spacer, {
		size,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	return {
		...metadata,
		anvilkit: {
			...metadata.anvilkit,
			editor: {
				...editor,
				styleTargets: {
					root: {
						...editor.styleTargets.root,
						label: t("spacer.targets.root"),
					},
				},
			},
		},
	};
}

function buildConfig(t: T): ComponentConfig<SpacerAuthorableProps> {
	return {
		label: t("spacer.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderSpacer,
	};
}

const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<SpacerAuthorableProps>;
export const spacerConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SpacerAuthorableProps>;
export const componentConfig = spacerConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SpacerAuthorableProps> {
	return buildConfig(createT(options));
}
export const createSpacerConfig = createComponentConfig;
