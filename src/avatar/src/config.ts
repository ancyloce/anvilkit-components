import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { AvatarProps } from "./Avatar";
import { Avatar } from "./Avatar";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import { sizeOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type AvatarAuthorableProps = AuthorableProps<AvatarProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Avatar.tsx:
 * the base-ui `root` circle and the `fallback` initials element, which
 * base-ui renders whenever the image is absent or fails — unconditional
 * wrapper DOM. The image is excluded: it renders only when `src` is set
 * and §2.1 forbids branch-conditional targets.
 */
const STYLE_TARGET_IDS = ["root", "fallback"] as const;

type AvatarTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Avatar",
	componentSlug: "avatar",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "display",
	// `root` is the circular frame (box vocabulary; its size is driven by
	// the `size` axis but authors may still override). `fallback` is the
	// text-bearing initials element — the one granted typography.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Avatar",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"minHeight",
						"maxHeight",
						"margin",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"overflow",
					],
				},
				fallback: {
					label: "Fallback",
					responsive: true,
					properties: [
						"display",
						"alignItems",
						"justifyContent",
						"background",
						"borderRadius",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textTransform",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	src: "",
	alt: "",
	fallback: "AK",
	size: "default",
} satisfies AvatarProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<AvatarAuthorableProps> {
	return {
		...authoringFields,
		src: {
			type: "text",
			label: t("avatar.fields.src.label"),
		},
		alt: {
			type: "text",
			label: t("avatar.fields.alt.label"),
		},
		fallback: {
			type: "text",
			label: t("avatar.fields.fallback.label"),
		},
		// Codegen output guarded by `check:fields-drift`; option order is the
		// upstream source order per DOC-01 §3.2 (FR-003).
		size: {
			type: "select",
			label: t("avatar.fields.size.label"),
			options: sizeOptions.map((value) => ({
				label: t(`avatar.fields.size.options.${value}`),
				value,
			})),
		},
		animation: animationField({
			label: t("avatar.fields.animation.label"),
			preset: t("avatar.fields.animation.preset"),
			presetOptions: {
				none: t("avatar.fields.animation.preset.options.none"),
				"fade-in": t("avatar.fields.animation.preset.options.fade-in"),
				"slide-up": t("avatar.fields.animation.preset.options.slide-up"),
				"slide-down": t("avatar.fields.animation.preset.options.slide-down"),
				"zoom-in": t("avatar.fields.animation.preset.options.zoom-in"),
			},
			duration: t("avatar.fields.animation.duration"),
			delay: t("avatar.fields.animation.delay"),
			easing: t("avatar.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`avatar.targets.${targetId}`),
			})),
			t("avatar.fields.classNames.label"),
		),
	};
}

const renderAvatar: ComponentConfig<AvatarAuthorableProps>["render"] = ({
	id,
	src,
	alt,
	fallback,
	size,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Avatar, {
		src,
		alt,
		fallback,
		size,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			fallback: anvilTargetAttrs(id, "fallback"),
		} satisfies Record<Exclude<AvatarTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `avatar.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`avatar.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<AvatarAuthorableProps> {
	return {
		label: t("avatar.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderAvatar,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<AvatarAuthorableProps>;

export const avatarConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<AvatarAuthorableProps>;

export const componentConfig = avatarConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<AvatarAuthorableProps> {
	return buildConfig(createT(options));
}

export const createAvatarConfig = createComponentConfig;
