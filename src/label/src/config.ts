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
import type { LabelProps } from "./Label";
import { Label } from "./Label";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type LabelAuthorableProps = AuthorableProps<LabelProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Label.tsx:
 * the wrapper renders exactly one `@anvilkit/ui` `<label>` carrying
 * `text` as a bare text child. There is no inner element to stamp, so
 * `root` is the whole map (§8.5).
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Label",
	componentSlug: "label",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "inputs",
	// The single `root` element is a flex, text-bearing label, so the
	// grantable box + typography vocabulary is CSS-sane on it. `cursor`
	// is withheld (not independently interactive) and `zIndex` is
	// withheld because this target IS the component root (ADR 0007
	// decision 5).
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Label",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
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
			inlineText: [{ id: "text", propPath: "text", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	text: "Label",
} satisfies LabelProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<LabelAuthorableProps> {
	return {
		...authoringFields,
		text: {
			type: "text",
			label: t("label.fields.text.label"),
		},
		animation: animationField({
			label: t("label.fields.animation.label"),
			preset: t("label.fields.animation.preset"),
			presetOptions: {
				none: t("label.fields.animation.preset.options.none"),
				"fade-in": t("label.fields.animation.preset.options.fade-in"),
				"slide-up": t("label.fields.animation.preset.options.slide-up"),
				"slide-down": t("label.fields.animation.preset.options.slide-down"),
				"zoom-in": t("label.fields.animation.preset.options.zoom-in"),
			},
			duration: t("label.fields.animation.duration"),
			delay: t("label.fields.animation.delay"),
			easing: t("label.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`label.targets.${targetId}`),
			})),
			t("label.fields.classNames.label"),
		),
	};
}

const renderLabel: ComponentConfig<LabelAuthorableProps>["render"] = ({
	id,
	text,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Label, {
		text,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `label.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`label.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<LabelAuthorableProps> {
	return {
		label: t("label.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderLabel,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<LabelAuthorableProps>;

export const labelConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<LabelAuthorableProps>;

export const componentConfig = labelConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<LabelAuthorableProps> {
	return buildConfig(createT(options));
}

export const createLabelConfig = createComponentConfig;
