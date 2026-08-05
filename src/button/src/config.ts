import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import {
	type AuthorableProps,
	anvilRootAttrs,
	authoringFields,
} from "./authoring";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type ButtonAuthorableProps = AuthorableProps<ButtonProps>;

export const metadata = {
	componentName: "Button",
	componentSlug: "button",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "actions",
	// PLAN-0025 metadata v2 (§6.1/§6.3): named targets with property
	// allowlists — plain data, no runtime import. The compiler enforces
	// the same allowlist the Inspector offers.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Button",
					responsive: true,
					properties: [
						"width",
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
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

function buildConfig(t: T): ComponentConfig<ButtonAuthorableProps> {
	return {
		label: t("button.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
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
