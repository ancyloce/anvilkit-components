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
import type { IconProps } from "./Icon";
import { Icon } from "./Icon";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type IconAuthorableProps = AuthorableProps<IconProps>;

const STYLE_TARGET_IDS = ["root", "icon"] as const;
type IconTargetId = (typeof STYLE_TARGET_IDS)[number];

const iconOptions = [
	"sparkles",
	"check",
	"arrow-right",
	"heart",
	"star",
	"circle",
] as const;
const sizeOptions = ["sm", "md", "lg", "xl"] as const;

export const metadata = {
	componentName: "Icon",
	componentSlug: "icon",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "media",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Icon",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"alignItems",
						"justifyContent",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"color",
					],
				},
				icon: {
					label: "Glyph",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"height",
						"opacity",
						"color",
						"filter",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	name: "sparkles",
	size: "md",
	strokeWidth: 2,
	decorative: true,
	label: "Sparkles",
} satisfies IconProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<IconAuthorableProps> {
	return {
		...authoringFields,
		name: {
			type: "select",
			label: t("icon.fields.name.label"),
			options: iconOptions.map((value) => ({
				label: t(`icon.fields.name.options.${value}`),
				value,
			})),
		},
		size: {
			type: "radio",
			label: t("icon.fields.size.label"),
			options: sizeOptions.map((value) => ({
				label: t(`icon.fields.size.options.${value}`),
				value,
			})),
		},
		strokeWidth: {
			type: "select",
			label: t("icon.fields.strokeWidth.label"),
			options: [1, 1.5, 2, 2.5].map((value) => ({
				label: String(value),
				value,
			})),
		},
		decorative: {
			type: "radio",
			label: t("icon.fields.decorative.label"),
			options: [
				{ label: t("icon.fields.decorative.options.true"), value: true },
				{ label: t("icon.fields.decorative.options.false"), value: false },
			],
		},
		label: { type: "text", label: t("icon.fields.label.label") },
		animation: animationField({
			label: t("icon.fields.animation.label"),
			preset: t("icon.fields.animation.preset"),
			presetOptions: {
				none: t("icon.fields.animation.preset.options.none"),
				"fade-in": t("icon.fields.animation.preset.options.fade-in"),
				"slide-up": t("icon.fields.animation.preset.options.slide-up"),
				"slide-down": t("icon.fields.animation.preset.options.slide-down"),
				"zoom-in": t("icon.fields.animation.preset.options.zoom-in"),
			},
			duration: t("icon.fields.animation.duration"),
			delay: t("icon.fields.animation.delay"),
			easing: t("icon.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`icon.targets.${targetId}`),
			})),
			t("icon.fields.classNames.label"),
		),
	};
}

const renderIcon: ComponentConfig<IconAuthorableProps>["render"] = ({
	id,
	name,
	size,
	strokeWidth,
	decorative,
	label,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Icon, {
		name,
		size,
		strokeWidth,
		decorative,
		label,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			icon: anvilTargetAttrs(id, "icon"),
		} satisfies Record<Exclude<IconTargetId, "root">, Record<string, string>>,
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`icon.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<IconAuthorableProps> {
	return {
		label: t("icon.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderIcon,
	};
}

const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<IconAuthorableProps>;
export const iconConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<IconAuthorableProps>;
export const componentConfig = iconConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<IconAuthorableProps> {
	return buildConfig(createT(options));
}
export const createIconConfig = createComponentConfig;
