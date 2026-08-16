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
import type { CheckboxProps } from "./Checkbox";
import { Checkbox } from "./Checkbox";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type CheckboxAuthorableProps = AuthorableProps<CheckboxProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Checkbox.tsx:
 * the wrapper owns a flex `root` row holding the base-ui `control` box
 * and its paired `label`. All three are real wrapper DOM; `label` is
 * conditional on its prop (same allowance the `card` package's
 * title/description carry) and is present under `defaultProps`.
 */
const STYLE_TARGET_IDS = ["root", "control", "label"] as const;

type CheckboxTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Checkbox",
	componentSlug: "checkbox",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "inputs",
	// `root` is the flex row (box vocabulary, no typography of its own);
	// `control` is the square box (box vocabulary, no text); `label` is
	// the only text-bearing target and is the one granted typography.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Checkbox",
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
						"direction",
						"wrap",
						"opacity",
					],
				},
				control: {
					label: "Control",
					responsive: true,
					properties: [
						"width",
						"height",
						"margin",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
						"color",
					],
				},
				label: {
					label: "Label",
					responsive: true,
					properties: [
						"display",
						"margin",
						"padding",
						"gap",
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
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	label: "Accept terms",
	defaultChecked: false,
	disabled: false,
} satisfies CheckboxProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<CheckboxAuthorableProps> {
	return {
		...authoringFields,
		label: {
			type: "text",
			label: t("checkbox.fields.label.label"),
		},
		defaultChecked: {
			type: "radio",
			label: t("checkbox.fields.defaultChecked.label"),
			options: [
				{
					label: t("checkbox.fields.defaultChecked.options.false"),
					value: false,
				},
				{
					label: t("checkbox.fields.defaultChecked.options.true"),
					value: true,
				},
			],
		},
		disabled: {
			type: "radio",
			label: t("checkbox.fields.disabled.label"),
			options: [
				{ label: t("checkbox.fields.disabled.options.false"), value: false },
				{ label: t("checkbox.fields.disabled.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("checkbox.fields.animation.label"),
			preset: t("checkbox.fields.animation.preset"),
			presetOptions: {
				none: t("checkbox.fields.animation.preset.options.none"),
				"fade-in": t("checkbox.fields.animation.preset.options.fade-in"),
				"slide-up": t("checkbox.fields.animation.preset.options.slide-up"),
				"slide-down": t("checkbox.fields.animation.preset.options.slide-down"),
				"zoom-in": t("checkbox.fields.animation.preset.options.zoom-in"),
			},
			duration: t("checkbox.fields.animation.duration"),
			delay: t("checkbox.fields.animation.delay"),
			easing: t("checkbox.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`checkbox.targets.${targetId}`),
			})),
			t("checkbox.fields.classNames.label"),
		),
	};
}

const renderCheckbox: ComponentConfig<CheckboxAuthorableProps>["render"] = ({
	id,
	label,
	defaultChecked,
	disabled,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Checkbox, {
		label,
		defaultChecked,
		disabled,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			control: anvilTargetAttrs(id, "control"),
			label: anvilTargetAttrs(id, "label"),
		} satisfies Record<
			Exclude<CheckboxTargetId, "root">,
			Record<string, string>
		>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `checkbox.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`checkbox.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<CheckboxAuthorableProps> {
	return {
		label: t("checkbox.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderCheckbox,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<CheckboxAuthorableProps>;

export const checkboxConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<CheckboxAuthorableProps>;

export const componentConfig = checkboxConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<CheckboxAuthorableProps> {
	return buildConfig(createT(options));
}

export const createCheckboxConfig = createComponentConfig;
