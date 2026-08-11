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
import type { ButtonProps } from "./Button";
import { Button } from "./Button";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type ButtonAuthorableProps = AuthorableProps<ButtonProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Button.tsx:
 * the component renders exactly ONE element in both branches — the
 * interactive `<a>` and the `@anvilkit/ui` `<button>` — with `label` as
 * a bare text child. There is no inner label/icon element to stamp, so
 * `root` is the whole map; wrapping the label in a span purely to gain
 * a second target would fabricate DOM the component does not have
 * (§8.5). `root` therefore carries the full grantable §6.1 vocabulary,
 * typography included — it is the text-bearing element itself.
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Button",
	componentSlug: "button",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "actions",
	// PLAN-0025 metadata v2 (§6.1/§6.3) + PLAN-0027 §2.1 per-element
	// targets: named targets with property allowlists — plain data, no
	// runtime import. The compiler enforces the same allowlist the
	// Inspector offers. The single `root` element is an inline-flex,
	// text-bearing control, so every grantable §6.1 property is
	// CSS-sane on it (gap/alignItems/justifyContent act on the flex box
	// `buttonVariants` establishes; typography acts on the label text).
	// p6-003 widening rule: one target, one element — an inline-flex,
	// text-bearing, interactive control that already grants `position`.
	// `inset` is paired with that `position` grant, because the author
	// owns the positioning scheme and offsets are therefore meaningful;
	// `direction`/`wrap`/`rowGap`/`columnGap` act on the flex box
	// `buttonVariants` establishes; `cursor` and the three text properties
	// act on the control and its label. `zIndex` is withheld: this target
	// IS the component root, so its stacking would escape into the page —
	// the constraint ADR 0007 decision 5 re-homed to this task.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Button",
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
			inlineText: [{ id: "label", propPath: "label", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	label: "Save changes",
	variant: "primary",
	disabled: false,
	href: "",
	openInNewTab: false,
	trackClick: false,
} satisfies ButtonProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<ButtonAuthorableProps> {
	return {
		...authoringFields,
		label: {
			type: "text",
			label: t("button.fields.label.label"),
		},
		variant: {
			type: "radio",
			label: t("button.fields.variant.label"),
			options: [
				{
					label: t("button.fields.variant.options.primary"),
					value: "primary",
				},
				{
					label: t("button.fields.variant.options.secondary"),
					value: "secondary",
				},
			],
		},
		href: {
			type: "text",
			label: t("button.fields.href.label"),
		},
		openInNewTab: {
			type: "radio",
			label: t("button.fields.openInNewTab.label"),
			options: [
				{
					label: t("button.fields.openInNewTab.options.false"),
					value: false,
				},
				{
					label: t("button.fields.openInNewTab.options.true"),
					value: true,
				},
			],
		},
		disabled: {
			type: "radio",
			label: t("button.fields.disabled.label"),
			options: [
				{
					label: t("button.fields.disabled.options.false"),
					value: false,
				},
				{
					label: t("button.fields.disabled.options.true"),
					value: true,
				},
			],
		},
		trackClick: {
			type: "radio",
			label: t("button.fields.trackClick.label"),
			options: [
				{
					label: t("button.fields.trackClick.options.false"),
					value: false,
				},
				{
					label: t("button.fields.trackClick.options.true"),
					value: true,
				},
			],
		},
		eventName: {
			type: "text",
			label: t("button.fields.eventName.label"),
		},
		eventProps: {
			type: "object",
			label: t("button.fields.eventProps.label"),
			objectFields: {
				category: {
					type: "text",
					label: t("button.fields.eventProps.fields.category.label"),
				},
				placement: {
					type: "text",
					label: t("button.fields.eventProps.fields.placement.label"),
				},
			},
		},
		animation: animationField({
			label: t("button.fields.animation.label"),
			preset: t("button.fields.animation.preset"),
			presetOptions: {
				none: t("button.fields.animation.preset.options.none"),
				"fade-in": t("button.fields.animation.preset.options.fade-in"),
				"slide-up": t("button.fields.animation.preset.options.slide-up"),
				"slide-down": t("button.fields.animation.preset.options.slide-down"),
				"zoom-in": t("button.fields.animation.preset.options.zoom-in"),
			},
			duration: t("button.fields.animation.duration"),
			delay: t("button.fields.animation.delay"),
			easing: t("button.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`button.targets.${targetId}`),
			})),
			t("button.fields.classNames.label"),
		),
	};
}

const renderButton: ComponentConfig<ButtonAuthorableProps>["render"] = ({
	id,
	label,
	variant,
	disabled,
	href,
	openInNewTab,
	editMode,
	trackClick,
	eventName,
	eventProps,
	classNames,
	animation,
}) =>
	createElement(Button, {
		label,
		variant,
		disabled,
		href,
		openInNewTab,
		editMode,
		trackClick,
		eventName,
		eventProps,
		classNames,
		animation,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `button.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label. Under
 * the default (en) `t` each label resolves to the literal declared
 * above, so the static `componentConfig` export is unchanged.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`button.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<ButtonAuthorableProps> {
	return {
		label: t("button.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderButton,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<ButtonAuthorableProps>;

export const buttonConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ButtonAuthorableProps>;

export const componentConfig = buttonConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ButtonAuthorableProps> {
	return buildConfig(createT(options));
}

export const createButtonConfig = createComponentConfig;
