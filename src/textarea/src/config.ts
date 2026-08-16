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
import type { TextareaProps } from "./Textarea";
import { Textarea } from "./Textarea";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type TextareaAuthorableProps = AuthorableProps<TextareaProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Textarea.tsx:
 * the wrapper renders exactly one `@anvilkit/ui` `<textarea>` element.
 * There is no label, helper, or container element — DOC-01 §5.7 keeps
 * this wrapper bare and composes labelling via the `label` package — so
 * `root` is the whole map (§8.5 forbids fabricating DOM to gain targets).
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Textarea",
	componentSlug: "textarea",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "inputs",
	// The single `root` element is the text-bearing control itself, so it
	// carries the box + typography vocabulary. `cursor` is withheld: the
	// control owns its own interactive cursor semantics. `zIndex` is
	// withheld because this target IS the component root, so its stacking
	// would escape into the page (ADR 0007 decision 5).
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Textarea",
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
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
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
	placeholder: "Enter a value",
	defaultValue: "",
	disabled: false,
} satisfies TextareaProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<TextareaAuthorableProps> {
	return {
		...authoringFields,
		placeholder: {
			type: "text",
			label: t("textarea.fields.placeholder.label"),
		},
		defaultValue: {
			type: "textarea",
			label: t("textarea.fields.defaultValue.label"),
		},
		disabled: {
			type: "radio",
			label: t("textarea.fields.disabled.label"),
			options: [
				{ label: t("textarea.fields.disabled.options.false"), value: false },
				{ label: t("textarea.fields.disabled.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("textarea.fields.animation.label"),
			preset: t("textarea.fields.animation.preset"),
			presetOptions: {
				none: t("textarea.fields.animation.preset.options.none"),
				"fade-in": t("textarea.fields.animation.preset.options.fade-in"),
				"slide-up": t("textarea.fields.animation.preset.options.slide-up"),
				"slide-down": t("textarea.fields.animation.preset.options.slide-down"),
				"zoom-in": t("textarea.fields.animation.preset.options.zoom-in"),
			},
			duration: t("textarea.fields.animation.duration"),
			delay: t("textarea.fields.animation.delay"),
			easing: t("textarea.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`textarea.targets.${targetId}`),
			})),
			t("textarea.fields.classNames.label"),
		),
	};
}

const renderTextarea: ComponentConfig<TextareaAuthorableProps>["render"] = ({
	id,
	placeholder,
	defaultValue,
	disabled,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Textarea, {
		placeholder,
		defaultValue,
		disabled,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `textarea.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`textarea.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<TextareaAuthorableProps> {
	return {
		label: t("textarea.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderTextarea,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<TextareaAuthorableProps>;

export const textareaConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<TextareaAuthorableProps>;

export const componentConfig = textareaConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<TextareaAuthorableProps> {
	return buildConfig(createT(options));
}

export const createTextareaConfig = createComponentConfig;
