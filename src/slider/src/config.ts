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
import type { SliderProps } from "./Slider";
import { Slider } from "./Slider";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type SliderAuthorableProps = AuthorableProps<SliderProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Slider.tsx:
 * the wrapper renders the base-ui slider root and nothing of its own.
 * The track/indicator/thumb are upstream-internal parts the wrapper
 * never stamps, so `root` is the whole map (§8.5).
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Slider",
	componentSlug: "slider",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "inputs",
	// A non-text control: box vocabulary only, no typography. `zIndex` is
	// withheld because this target IS the component root (ADR 0007
	// decision 5).
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Slider",
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
						"opacity",
						"inset",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	defaultValue: 50,
	min: 0,
	max: 100,
	step: 1,
	disabled: false,
} satisfies SliderProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SliderAuthorableProps> {
	return {
		...authoringFields,
		defaultValue: {
			type: "number",
			label: t("slider.fields.defaultValue.label"),
		},
		min: {
			type: "number",
			label: t("slider.fields.min.label"),
		},
		max: {
			type: "number",
			label: t("slider.fields.max.label"),
		},
		step: {
			type: "number",
			label: t("slider.fields.step.label"),
			min: 1,
		},
		disabled: {
			type: "radio",
			label: t("slider.fields.disabled.label"),
			options: [
				{ label: t("slider.fields.disabled.options.false"), value: false },
				{ label: t("slider.fields.disabled.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("slider.fields.animation.label"),
			preset: t("slider.fields.animation.preset"),
			presetOptions: {
				none: t("slider.fields.animation.preset.options.none"),
				"fade-in": t("slider.fields.animation.preset.options.fade-in"),
				"slide-up": t("slider.fields.animation.preset.options.slide-up"),
				"slide-down": t("slider.fields.animation.preset.options.slide-down"),
				"zoom-in": t("slider.fields.animation.preset.options.zoom-in"),
			},
			duration: t("slider.fields.animation.duration"),
			delay: t("slider.fields.animation.delay"),
			easing: t("slider.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`slider.targets.${targetId}`),
			})),
			t("slider.fields.classNames.label"),
		),
	};
}

const renderSlider: ComponentConfig<SliderAuthorableProps>["render"] = ({
	id,
	defaultValue,
	min,
	max,
	step,
	disabled,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Slider, {
		defaultValue,
		min,
		max,
		step,
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
 * `label` through `t()` using the same `slider.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`slider.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<SliderAuthorableProps> {
	return {
		label: t("slider.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderSlider,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<SliderAuthorableProps>;

export const sliderConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SliderAuthorableProps>;

export const componentConfig = sliderConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SliderAuthorableProps> {
	return buildConfig(createT(options));
}

export const createSliderConfig = createComponentConfig;
