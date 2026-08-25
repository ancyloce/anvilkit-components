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
import type { LinkProps } from "./Link";
import { Link } from "./Link";

export type LinkAuthorableProps = AuthorableProps<LinkProps>;

const STYLE_TARGET_IDS = ["root"] as const;

const variantOptions = ["default", "muted", "underline"] as const;
const sizeOptions = ["sm", "md", "lg"] as const;

export const metadata = {
	componentName: "Link",
	componentSlug: "link",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "actions",
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Link",
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
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"direction",
						"wrap",
						"rowGap",
						"columnGap",
						"minHeight",
						"maxHeight",
						"inset",
						"overflow",
						"cursor",
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
			},
			inlineText: [{ id: "root", propPath: "text", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	text: "Learn more",
	href: "/",
	openInNewTab: false,
	variant: "default",
	size: "md",
} satisfies LinkProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<LinkAuthorableProps> {
	return {
		...authoringFields,
		text: { type: "text", label: t("link.fields.text.label") },
		href: { type: "text", label: t("link.fields.href.label") },
		openInNewTab: {
			type: "radio",
			label: t("link.fields.openInNewTab.label"),
			options: [
				{ label: t("link.fields.openInNewTab.options.false"), value: false },
				{ label: t("link.fields.openInNewTab.options.true"), value: true },
			],
		},
		variant: {
			type: "select",
			label: t("link.fields.variant.label"),
			options: variantOptions.map((value) => ({
				label: t(`link.fields.variant.options.${value}`),
				value,
			})),
		},
		size: {
			type: "radio",
			label: t("link.fields.size.label"),
			options: sizeOptions.map((value) => ({
				label: t(`link.fields.size.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("link.fields.animation.label"),
			preset: t("link.fields.animation.preset"),
			presetOptions: {
				none: t("link.fields.animation.preset.options.none"),
				"fade-in": t("link.fields.animation.preset.options.fade-in"),
				"slide-up": t("link.fields.animation.preset.options.slide-up"),
				"slide-down": t("link.fields.animation.preset.options.slide-down"),
				"zoom-in": t("link.fields.animation.preset.options.zoom-in"),
			},
			duration: t("link.fields.animation.duration"),
			delay: t("link.fields.animation.delay"),
			easing: t("link.fields.animation.easing"),
		}),
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`link.targets.${targetId}`),
			})),
			t("link.fields.classNames.label"),
		),
	};
}

const renderLink: ComponentConfig<LinkAuthorableProps>["render"] = ({
	id,
	text,
	href,
	openInNewTab,
	variant,
	size,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Link, {
		text,
		href,
		openInNewTab,
		variant,
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
						label: t("link.targets.root"),
					},
				},
			},
		},
	};
}

function buildConfig(t: T): ComponentConfig<LinkAuthorableProps> {
	return {
		label: t("link.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderLink,
	};
}

const defaultT = createT();
export const fields = buildFields(
	defaultT,
) satisfies Fields<LinkAuthorableProps>;
export const linkConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<LinkAuthorableProps>;
export const componentConfig = linkConfig;
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<LinkAuthorableProps> {
	return buildConfig(createT(options));
}
export const createLinkConfig = createComponentConfig;
