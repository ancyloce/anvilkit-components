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
import type { InputProps } from "./Input";
import { Input } from "./Input";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type InputAuthorableProps = AuthorableProps<InputProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Input.tsx:
 * the `<label>` wrapper IS the root (no separate field container
 * exists), the caption `<span>` is `label`, the `@anvilkit/ui` input is
 * `control`, and the helper `<span>` is `helperText` — it renders
 * whenever `helperText` is non-empty (it is in `defaultProps`) and is
 * simply absent when the author clears the prop, exactly like an empty
 * collection. Input has no prefix/suffix/error DOM, so no such target
 * is fabricated.
 */
const STYLE_TARGET_IDS = ["root", "label", "control", "helperText"] as const;

type InputTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Input",
	componentSlug: "input",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "form",
	schemaVersion: 1,
	suggestedCategory: "forms",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography is granted on the three text-bearing targets only (the
	// root is a pure layout wrapper). State rules (`:focus`) stay
	// component-owned; author values never carry `!important`.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Field",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
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
						"width",
						"maxWidth",
						"margin",
						"padding",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
				control: {
					label: "Control",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
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
					],
				},
				helperText: {
					label: "Helper text",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
			},
			inlineText: [
				{ id: "label", propPath: "label", format: "plain" },
				{ id: "helperText", propPath: "helperText", format: "plain" },
			],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	label: "Email address",
	name: "email",
	type: "email",
	placeholder: "Enter your email",
	helperText: "We will only use this for important updates.",
	defaultValue: "",
	required: false,
	disabled: false,
} satisfies InputProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<InputAuthorableProps> {
	return {
		...authoringFields,
		label: {
			type: "text",
			label: t("input.fields.label.label"),
		},
		name: {
			type: "text",
			label: t("input.fields.name.label"),
		},
		type: {
			type: "select",
			label: t("input.fields.type.label"),
			options: [
				{
					label: t("input.fields.type.options.text"),
					value: "text",
				},
				{
					label: t("input.fields.type.options.email"),
					value: "email",
				},
				{
					label: t("input.fields.type.options.password"),
					value: "password",
				},
				{
					label: t("input.fields.type.options.search"),
					value: "search",
				},
				{
					label: t("input.fields.type.options.tel"),
					value: "tel",
				},
				{
					label: t("input.fields.type.options.url"),
					value: "url",
				},
			],
		},
		placeholder: {
			type: "text",
			label: t("input.fields.placeholder.label"),
		},
		helperText: {
			type: "textarea",
			label: t("input.fields.helperText.label"),
		},
		defaultValue: {
			type: "text",
			label: t("input.fields.defaultValue.label"),
		},
		required: {
			type: "radio",
			label: t("input.fields.required.label"),
			options: [
				{
					label: t("input.fields.required.options.false"),
					value: false,
				},
				{
					label: t("input.fields.required.options.true"),
					value: true,
				},
			],
		},
		disabled: {
			type: "radio",
			label: t("input.fields.disabled.label"),
			options: [
				{
					label: t("input.fields.disabled.options.false"),
					value: false,
				},
				{
					label: t("input.fields.disabled.options.true"),
					value: true,
				},
			],
		},
		animation: animationField({
			label: t("input.fields.animation.label"),
			preset: t("input.fields.animation.preset"),
			presetOptions: {
				none: t("input.fields.animation.preset.options.none"),
				"fade-in": t("input.fields.animation.preset.options.fade-in"),
				"slide-up": t("input.fields.animation.preset.options.slide-up"),
				"slide-down": t("input.fields.animation.preset.options.slide-down"),
				"zoom-in": t("input.fields.animation.preset.options.zoom-in"),
			},
			duration: t("input.fields.animation.duration"),
			delay: t("input.fields.animation.delay"),
			easing: t("input.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`input.targets.${targetId}`),
			})),
			t("input.fields.classNames.label"),
		),
	};
}

const renderInput: ComponentConfig<InputAuthorableProps>["render"] = ({
	id,
	label,
	name,
	type,
	placeholder,
	helperText,
	defaultValue,
	required,
	disabled,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Input, {
		label,
		name,
		type,
		placeholder,
		helperText,
		defaultValue,
		required,
		disabled,
		classNames,
		animation,
		editMode,
		// §6.2: stable targets from the official render; the compiler
		// owns CSS materialization.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			label: anvilTargetAttrs(id, "label"),
			control: anvilTargetAttrs(id, "control"),
			helperText: anvilTargetAttrs(id, "helperText"),
		} satisfies Record<Exclude<InputTargetId, "root">, Record<string, string>>,
	});

function buildConfig(t: T): ComponentConfig<InputAuthorableProps> {
	return {
		label: t("input.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderInput,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<InputAuthorableProps>;

export const inputConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<InputAuthorableProps>;

export const componentConfig = inputConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<InputAuthorableProps> {
	return buildConfig(createT(options));
}

export const createInputConfig = createComponentConfig;
