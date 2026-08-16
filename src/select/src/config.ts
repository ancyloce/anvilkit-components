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
import { triggerSizeOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { SelectOption, SelectProps } from "./Select";
import { Select } from "./Select";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type SelectAuthorableProps = AuthorableProps<SelectProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Select.tsx:
 * base-ui's `Root` renders no element, so the trigger is the only
 * always-present element this component owns, so it IS this component's
 * root target (the repo invariant the parity suite enforces: the
 * outermost stamped element carries target id `root`; its human label
 * stays "Trigger"). The popup is portal'd into the canvas iframe
 * document (DOC-01 §3.9) and is excluded in v1.
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Select",
	componentSlug: "select",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "inputs",
	// The trigger is an inline-flex, text-bearing interactive control —
	// the same shape as the Button exemplar, so it takes the same
	// grantable vocabulary including `cursor` and the typography axis.
	// `zIndex` is withheld: this target is the component's outermost
	// element, so its stacking would escape into the page.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Trigger",
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
						"gap",
						"rowGap",
						"columnGap",
						"alignItems",
						"justifyContent",
						"direction",
						"wrap",
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
						"cursor",
						"textDecoration",
						"textTransform",
						"textWrap",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

const defaultOptions: SelectOption[] = [
	{ label: "Option one", value: "option-1" },
	{ label: "Option two", value: "option-2" },
	{ label: "Option three", value: "option-3" },
];

export const defaultProps = {
	options: defaultOptions,
	placeholder: "Select…",
	defaultValue: "",
	triggerSize: "default",
	disabled: false,
} satisfies SelectProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<SelectAuthorableProps> {
	return {
		...authoringFields,
		options: {
			type: "array",
			label: t("select.fields.options.label"),
			defaultItemProps: { label: "New option", value: "new-option" },
			getItemSummary: (item: SelectOption, index?: number) =>
				item.label ||
				t("select.fields.options.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				label: {
					type: "text",
					label: t("select.fields.options.fields.label.label"),
				},
				value: {
					type: "text",
					label: t("select.fields.options.fields.value.label"),
				},
			},
		},
		placeholder: {
			type: "text",
			label: t("select.fields.placeholder.label"),
		},
		defaultValue: {
			type: "text",
			label: t("select.fields.defaultValue.label"),
		},
		// shadcn `SelectTrigger` size axis (DOC-01 §5.5); switched to
		// fields.gen.ts output in P1-03.
		// Codegen output guarded by `check:fields-drift`; option order is the
		// upstream source order per DOC-01 §3.2 (FR-003).
		triggerSize: {
			type: "radio",
			label: t("select.fields.triggerSize.label"),
			options: triggerSizeOptions.map((value) => ({
				label: t(`select.fields.triggerSize.options.${value}`),
				value,
			})),
		},
		disabled: {
			type: "radio",
			label: t("select.fields.disabled.label"),
			options: [
				{ label: t("select.fields.disabled.options.false"), value: false },
				{ label: t("select.fields.disabled.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("select.fields.animation.label"),
			preset: t("select.fields.animation.preset"),
			presetOptions: {
				none: t("select.fields.animation.preset.options.none"),
				"fade-in": t("select.fields.animation.preset.options.fade-in"),
				"slide-up": t("select.fields.animation.preset.options.slide-up"),
				"slide-down": t("select.fields.animation.preset.options.slide-down"),
				"zoom-in": t("select.fields.animation.preset.options.zoom-in"),
			},
			duration: t("select.fields.animation.duration"),
			delay: t("select.fields.animation.delay"),
			easing: t("select.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`select.targets.${targetId}`),
			})),
			t("select.fields.classNames.label"),
		),
	};
}

const renderSelect: ComponentConfig<SelectAuthorableProps>["render"] = ({
	id,
	options,
	placeholder,
	defaultValue,
	triggerSize,
	disabled,
	editMode,
	classNames,
	animation,
}) =>
	createElement(Select, {
		options,
		placeholder,
		defaultValue,
		triggerSize,
		disabled,
		editMode,
		classNames,
		animation,
		// §6.2/§6.3: the official render emits stable targets on the
		// trigger — the component's outermost real element.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `select.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`select.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<SelectAuthorableProps> {
	return {
		label: t("select.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderSelect,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<SelectAuthorableProps>;

export const selectConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<SelectAuthorableProps>;

export const componentConfig = selectConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<SelectAuthorableProps> {
	return buildConfig(createT(options));
}

export const createSelectConfig = createComponentConfig;
