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
import type { SeparatorProps } from "./Separator";
import { Separator } from "./Separator";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type SeparatorAuthorableProps = AuthorableProps<SeparatorProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Separator.tsx:
 * the component renders exactly one base-ui separator element and no
 * children at all, so `root` is the whole map.
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Separator",
	componentSlug: "separator",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "display",
	// A rule element: it carries no text, so the typography vocabulary is
	// withheld; the box/spacing/background properties are the meaningful
	// ones (the base classes drive height/width off the orientation data
	// attributes). `zIndex` is withheld — this target IS the component
	// root, so its stacking would escape into the page.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Separator",
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
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"inset",
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
	orientation: "horizontal",
} satisfies SeparatorProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SeparatorAuthorableProps> {
	return {
		...authoringFields,
		orientation: {
			type: "radio",
			label: t("separator.fields.orientation.label"),
			options: [
				{
					label: t("separator.fields.orientation.options.horizontal"),
					value: "horizontal",
				},
				{
					label: t("separator.fields.orientation.options.vertical"),
					value: "vertical",
				},
			],
		},
		animation: animationField({
			label: t("separator.fields.animation.label"),
			preset: t("separator.fields.animation.preset"),
			presetOptions: {
				none: t("separator.fields.animation.preset.options.none"),
				"fade-in": t("separator.fields.animation.preset.options.fade-in"),
				"slide-up": t("separator.fields.animation.preset.options.slide-up"),
				"slide-down": t("separator.fields.animation.preset.options.slide-down"),
				"zoom-in": t("separator.fields.animation.preset.options.zoom-in"),
			},
			duration: t("separator.fields.animation.duration"),
			delay: t("separator.fields.animation.delay"),
			easing: t("separator.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`separator.targets.${targetId}`),
			})),
			t("separator.fields.classNames.label"),
		),
	};
}

const renderSeparator: ComponentConfig<SeparatorAuthorableProps>["render"] = ({
	id,
	orientation,
	classNames,
	animation,
}) =>
	createElement(Separator, {
		orientation,
		classNames,
		animation,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `separator.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`separator.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<SeparatorAuthorableProps> {
	return {
		label: t("separator.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderSeparator,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<SeparatorAuthorableProps>;

export const separatorConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SeparatorAuthorableProps>;

export const componentConfig = separatorConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SeparatorAuthorableProps> {
	return buildConfig(createT(options));
}

export const createSeparatorConfig = createComponentConfig;
