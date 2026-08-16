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
import { sizeOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { SwitchProps } from "./Switch";
import { Switch } from "./Switch";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type SwitchAuthorableProps = AuthorableProps<SwitchProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Switch.tsx:
 * a flex `root` row holding the base-ui `control` track and its paired
 * `label`. `label` is conditional on its prop (same allowance the
 * `card` package's title/description carry) and present under defaults.
 */
const STYLE_TARGET_IDS = ["root", "control", "label"] as const;

type SwitchTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Switch",
	componentSlug: "switch",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "inputs",
	// `root` is the flex row, `control` the track (its width/height are
	// driven by the `size` axis, but authors may still override), and
	// `label` is the only text-bearing target — the one granted typography.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Switch",
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
	label: "Enable notifications",
	defaultChecked: false,
	size: "default",
	disabled: false,
} satisfies SwitchProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SwitchAuthorableProps> {
	return {
		...authoringFields,
		label: {
			type: "text",
			label: t("switch.fields.label.label"),
		},
		defaultChecked: {
			type: "radio",
			label: t("switch.fields.defaultChecked.label"),
			options: [
				{
					label: t("switch.fields.defaultChecked.options.false"),
					value: false,
				},
				{ label: t("switch.fields.defaultChecked.options.true"), value: true },
			],
		},
		// Codegen output guarded by `check:fields-drift`; option order is the
		// upstream source order per DOC-01 §3.2 (FR-003).
		size: {
			type: "radio",
			label: t("switch.fields.size.label"),
			options: sizeOptions.map((value) => ({
				label: t(`switch.fields.size.options.${value}`),
				value,
			})),
		},
		disabled: {
			type: "radio",
			label: t("switch.fields.disabled.label"),
			options: [
				{ label: t("switch.fields.disabled.options.false"), value: false },
				{ label: t("switch.fields.disabled.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("switch.fields.animation.label"),
			preset: t("switch.fields.animation.preset"),
			presetOptions: {
				none: t("switch.fields.animation.preset.options.none"),
				"fade-in": t("switch.fields.animation.preset.options.fade-in"),
				"slide-up": t("switch.fields.animation.preset.options.slide-up"),
				"slide-down": t("switch.fields.animation.preset.options.slide-down"),
				"zoom-in": t("switch.fields.animation.preset.options.zoom-in"),
			},
			duration: t("switch.fields.animation.duration"),
			delay: t("switch.fields.animation.delay"),
			easing: t("switch.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`switch.targets.${targetId}`),
			})),
			t("switch.fields.classNames.label"),
		),
	};
}

const renderSwitch: ComponentConfig<SwitchAuthorableProps>["render"] = ({
	id,
	label,
	defaultChecked,
	size,
	disabled,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Switch, {
		label,
		defaultChecked,
		size,
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
		} satisfies Record<Exclude<SwitchTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `switch.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`switch.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<SwitchAuthorableProps> {
	return {
		label: t("switch.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderSwitch,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<SwitchAuthorableProps>;

export const switchConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SwitchAuthorableProps>;

export const componentConfig = switchConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SwitchAuthorableProps> {
	return buildConfig(createT(options));
}

export const createSwitchConfig = createComponentConfig;
