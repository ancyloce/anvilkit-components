import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { Helps } from "./Helps";
import type { HelpsProps } from "./Helps";

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

export const fields = {
	message: {
		type: "textarea",
		label: "Message",
	},
	buttonLabel: {
		type: "text",
		label: "Button label",
	},
	buttonHref: {
		type: "text",
		label: "Button link",
	},
	buttonOpenInNewTab: {
		type: "radio",
		label: "Button opens in new tab",
		options: [
			{
				label: "No",
				value: false,
			},
			{
				label: "Yes",
				value: true,
			},
		],
	},
	avatars: {
		type: "array",
		label: "Contributors",
		defaultItemProps: {
			name: "New contributor",
			imageUrl: "",
			initials: "NC",
		},
		getItemSummary: (item, index) =>
			item.name || `Contributor ${(index ?? 0) + 1}`,
		arrayFields: {
			name: {
				type: "text",
				label: "Name",
			},
			imageUrl: {
				type: "text",
				label: "Image URL",
			},
			initials: {
				type: "text",
				label: "Fallback initials",
			},
		},
	},
} satisfies Fields<HelpsProps>;

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

export const helpsConfig = {
	label: "Helps",
	defaultProps,
	fields,
	metadata,
	render: renderHelps,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<HelpsProps>;

export const componentConfig = helpsConfig;
