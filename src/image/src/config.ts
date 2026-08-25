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
import type { ImageProps } from "./Image";
import { Image } from "./Image";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export type ImageAuthorableProps = AuthorableProps<ImageProps>;

const STYLE_TARGET_IDS = ["root", "media", "caption"] as const;
type ImageTargetId = (typeof STYLE_TARGET_IDS)[number];

const aspectRatioOptions = ["auto", "square", "video", "portrait"] as const;
const objectFitOptions = ["cover", "contain"] as const;
const loadingOptions = ["lazy", "eager"] as const;

export const metadata = {
	componentName: "Image",
	componentSlug: "image",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "media",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Image",
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
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"overflow",
					],
				},
				media: {
					label: "Media",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"minHeight",
						"maxHeight",
						"filter",
						"blendMode",
					],
				},
				caption: {
					label: "Caption",
					responsive: true,
					properties: [
						"display",
						"margin",
						"maxWidth",
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
			inlineText: [{ id: "caption", propPath: "caption", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
	alt: "A laptop on a desk",
	caption: "A flexible media block",
	aspectRatio: "video",
	objectFit: "cover",
	loading: "lazy",
} satisfies ImageProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<ImageAuthorableProps> {
	return {
		...authoringFields,
		src: { type: "text", label: t("image.fields.src.label") },
		alt: { type: "text", label: t("image.fields.alt.label") },
		caption: { type: "text", label: t("image.fields.caption.label") },
		aspectRatio: {
			type: "select",
			label: t("image.fields.aspectRatio.label"),
			options: aspectRatioOptions.map((value) => ({
				label: t(`image.fields.aspectRatio.options.${value}`),
				value,
			})),
		},
		objectFit: {
			type: "radio",
			label: t("image.fields.objectFit.label"),
			options: objectFitOptions.map((value) => ({
				label: t(`image.fields.objectFit.options.${value}`),
				value,
			})),
		},
		loading: {
			type: "radio",
			label: t("image.fields.loading.label"),
			options: loadingOptions.map((value) => ({
				label: t(`image.fields.loading.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("image.fields.animation.label"),
			preset: t("image.fields.animation.preset"),
			presetOptions: {
				none: t("image.fields.animation.preset.options.none"),
				"fade-in": t("image.fields.animation.preset.options.fade-in"),
				"slide-up": t("image.fields.animation.preset.options.slide-up"),
				"slide-down": t("image.fields.animation.preset.options.slide-down"),
				"zoom-in": t("image.fields.animation.preset.options.zoom-in"),
			},
			duration: t("image.fields.animation.duration"),
			delay: t("image.fields.animation.delay"),
			easing: t("image.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`image.targets.${targetId}`),
			})),
			t("image.fields.classNames.label"),
		),
	};
}

const renderImage: ComponentConfig<ImageAuthorableProps>["render"] = ({
	id,
	src,
	alt,
	caption,
	aspectRatio,
	objectFit,
	loading,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Image, {
		src,
		alt,
		caption,
		aspectRatio,
		objectFit,
		loading,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			media: anvilTargetAttrs(id, "media"),
			caption: anvilTargetAttrs(id, "caption"),
		} satisfies Record<Exclude<ImageTargetId, "root">, Record<string, string>>,
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`image.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<ImageAuthorableProps> {
	return {
		label: t("image.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderImage,
	};
}

const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<ImageAuthorableProps>;
export const imageConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ImageAuthorableProps>;
export const componentConfig = imageConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ImageAuthorableProps> {
	return buildConfig(createT(options));
}
export const createImageConfig = createComponentConfig;
