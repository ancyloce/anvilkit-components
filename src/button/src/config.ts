import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export const metadata = {
	componentName: "Button",
	componentSlug: "button",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "actions",
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

function buildFields(t: T): Fields<ButtonProps> {
	return {
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

const renderButton: ComponentConfig<ButtonProps>["render"] = ({
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
	});

function buildConfig(t: T): ComponentConfig<ButtonProps> {
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

export const fields = buildFields(defaultT) satisfies Fields<ButtonProps>;

export const buttonConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ButtonProps>;

export const componentConfig = buttonConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ButtonProps> {
	return buildConfig(createT(options));
}

export const createButtonConfig = createComponentConfig;
