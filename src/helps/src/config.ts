import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { HelpsProps } from "./Helps";
import { Helps } from "./Helps";
import { type CreateComponentConfigOptions, createT } from "./i18n";

export const metadata = {
	componentName: "Helps",
	componentSlug: "helps",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
} satisfies ComponentMetadata;

export const defaultProps = {
	message:
		"We're grateful for the amazing open-source community\nthat helps make our project better every day.",
	buttonLabel: "Become a contributor",
	buttonHref: "/contribute",
	buttonOpenInNewTab: false,
	avatars: [
		{
			name: "Alice Johnson",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "AJ",
		},
		{
			name: "Bob Brown",
			imageUrl:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "BB",
		},
		{
			name: "Charlie Davis",
			imageUrl:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "CD",
		},
		{
			name: "Diana Evans",
			imageUrl:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "DE",
		},
		{
			name: "Ethan Ford",
			imageUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "EF",
		},
	],
} satisfies HelpsProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<HelpsProps> {
	return {
		message: {
			type: "textarea",
			label: t("helps.fields.message.label"),
		},
		buttonLabel: {
			type: "text",
			label: t("helps.fields.buttonLabel.label"),
		},
		buttonHref: {
			type: "text",
			label: t("helps.fields.buttonHref.label"),
		},
		buttonOpenInNewTab: {
			type: "radio",
			label: t("helps.fields.buttonOpenInNewTab.label"),
			options: [
				{
					label: t("helps.fields.buttonOpenInNewTab.options.false"),
					value: false,
				},
				{
					label: t("helps.fields.buttonOpenInNewTab.options.true"),
					value: true,
				},
			],
		},
		avatars: {
			type: "array",
			label: t("helps.fields.avatars.label"),
			defaultItemProps: {
				name: "New contributor",
				imageUrl: "",
				initials: "NC",
			},
			getItemSummary: (item, index) =>
				item.name ||
				t("helps.fields.avatars.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				name: {
					type: "text",
					label: t("helps.fields.avatars.name.label"),
				},
				imageUrl: {
					type: "text",
					label: t("helps.fields.avatars.imageUrl.label"),
				},
				initials: {
					type: "text",
					label: t("helps.fields.avatars.initials.label"),
				},
			},
		},
	};
}

const renderHelps: ComponentConfig<HelpsProps>["render"] = ({
	message,
	buttonLabel,
	buttonHref,
	buttonOpenInNewTab,
	avatars,
	editMode,
}) =>
	createElement(Helps, {
		message,
		buttonLabel,
		buttonHref,
		buttonOpenInNewTab,
		avatars,
		editMode,
	});

function buildConfig(t: T): ComponentConfig<HelpsProps> {
	return {
		label: t("helps.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderHelps,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<HelpsProps>;

export const helpsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<HelpsProps>;

export const componentConfig = helpsConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<HelpsProps> {
	return buildConfig(createT(options));
}

export const createHelpsConfig = createComponentConfig;
