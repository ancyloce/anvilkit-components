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
import type { VideoProps } from "./Video";
import { Video } from "./Video";

export type VideoAuthorableProps = AuthorableProps<VideoProps>;

const STYLE_TARGET_IDS = ["root", "media", "caption"] as const;
type VideoTargetId = (typeof STYLE_TARGET_IDS)[number];

const aspectRatioOptions = ["video", "square", "portrait"] as const;

export const metadata = {
	componentName: "Video",
	componentSlug: "video",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "media",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Video",
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
						"background",
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
	src: "",
	title: "Product walkthrough",
	poster: "",
	caption: "Product walkthrough",
	captionsSrc: "",
	aspectRatio: "video",
	controls: true,
	autoPlay: false,
	muted: true,
	loop: false,
} satisfies VideoProps;

type T = ReturnType<typeof createT>;
type BooleanOptionKey =
	| "video.fields.controls.options"
	| "video.fields.autoPlay.options"
	| "video.fields.muted.options"
	| "video.fields.loop.options";

const booleanOptions = (t: T, key: BooleanOptionKey) => [
	{ label: t(`${key}.false`), value: false },
	{ label: t(`${key}.true`), value: true },
];

function buildFields(t: T): Fields<VideoAuthorableProps> {
	return {
		...authoringFields,
		src: { type: "text", label: t("video.fields.src.label") },
		title: { type: "text", label: t("video.fields.title.label") },
		poster: { type: "text", label: t("video.fields.poster.label") },
		caption: { type: "text", label: t("video.fields.caption.label") },
		captionsSrc: { type: "text", label: t("video.fields.captionsSrc.label") },
		aspectRatio: {
			type: "select",
			label: t("video.fields.aspectRatio.label"),
			options: aspectRatioOptions.map((value) => ({
				label: t(`video.fields.aspectRatio.options.${value}`),
				value,
			})),
		},
		controls: {
			type: "radio",
			label: t("video.fields.controls.label"),
			options: booleanOptions(t, "video.fields.controls.options"),
		},
		autoPlay: {
			type: "radio",
			label: t("video.fields.autoPlay.label"),
			options: booleanOptions(t, "video.fields.autoPlay.options"),
		},
		muted: {
			type: "radio",
			label: t("video.fields.muted.label"),
			options: booleanOptions(t, "video.fields.muted.options"),
		},
		loop: {
			type: "radio",
			label: t("video.fields.loop.label"),
			options: booleanOptions(t, "video.fields.loop.options"),
		},
		animation: animationField({
			label: t("video.fields.animation.label"),
			preset: t("video.fields.animation.preset"),
			presetOptions: {
				none: t("video.fields.animation.preset.options.none"),
				"fade-in": t("video.fields.animation.preset.options.fade-in"),
				"slide-up": t("video.fields.animation.preset.options.slide-up"),
				"slide-down": t("video.fields.animation.preset.options.slide-down"),
				"zoom-in": t("video.fields.animation.preset.options.zoom-in"),
			},
			duration: t("video.fields.animation.duration"),
			delay: t("video.fields.animation.delay"),
			easing: t("video.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`video.targets.${targetId}`),
			})),
			t("video.fields.classNames.label"),
		),
	};
}

const renderVideo: ComponentConfig<VideoAuthorableProps>["render"] = ({
	id,
	src,
	title,
	poster,
	caption,
	captionsSrc,
	aspectRatio,
	controls,
	autoPlay,
	muted,
	loop,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Video, {
		src,
		title,
		poster,
		caption,
		captionsSrc,
		aspectRatio,
		controls,
		autoPlay,
		muted,
		loop,
		classNames,
		animation,
		editMode,
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			media: anvilTargetAttrs(id, "media"),
			caption: anvilTargetAttrs(id, "caption"),
		} satisfies Record<Exclude<VideoTargetId, "root">, Record<string, string>>,
	});

function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`video.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<VideoAuthorableProps> {
	return {
		label: t("video.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderVideo,
	};
}

const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<VideoAuthorableProps>;
export const videoConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<VideoAuthorableProps>;
export const componentConfig = videoConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<VideoAuthorableProps> {
	return buildConfig(createT(options));
}
export const createVideoConfig = createComponentConfig;
