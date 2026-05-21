import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { HeroProps } from "./Hero";
import { Hero } from "./Hero";

export const metadata = {
	componentName: "Hero",
	componentSlug: "hero",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
} satisfies ComponentMetadata;

export const defaultProps = {
	announcementLabel: "We raised $69M pre seed",
	announcementHref: "",
	announcementOpenInNewTab: false,
	headline: "Write fast with\naccurate precision.",
	description:
		"Our state of the art tool is a tool that allows you to\nwrite copy instantly.",
	linuxLabel: "Download for Linux",
	linuxHref: "/download/linux",
	linuxOpenInNewTab: false,
	windowsLabel: "Download for Windows",
	windowsHref: "/download/windows",
	windowsOpenInNewTab: false,
} satisfies HeroProps;

export const fields = {
	announcementLabel: {
		type: "text",
		label: "Announcement label",
	},
	announcementHref: {
		type: "text",
		label: "Announcement link",
	},
	announcementOpenInNewTab: {
		type: "radio",
		label: "Announcement opens in new tab",
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
	headline: {
		type: "textarea",
		label: "Headline",
	},
	description: {
		type: "textarea",
		label: "Description",
	},
	linuxLabel: {
		type: "text",
		label: "Linux button label",
	},
	linuxHref: {
		type: "text",
		label: "Linux button link",
	},
	linuxOpenInNewTab: {
		type: "radio",
		label: "Linux opens in new tab",
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
	windowsLabel: {
		type: "text",
		label: "Windows button label",
	},
	windowsHref: {
		type: "text",
		label: "Windows button link",
	},
	windowsOpenInNewTab: {
		type: "radio",
		label: "Windows opens in new tab",
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
} satisfies Fields<HeroProps>;

const renderHero: ComponentConfig<HeroProps>["render"] = ({
	announcementLabel,
	announcementHref,
	announcementOpenInNewTab,
	headline,
	description,
	linuxLabel,
	linuxHref,
	linuxOpenInNewTab,
	windowsLabel,
	windowsHref,
	windowsOpenInNewTab,
	editMode,
}) =>
	createElement(Hero, {
		announcementLabel,
		announcementHref,
		announcementOpenInNewTab,
		headline,
		description,
		linuxLabel,
		linuxHref,
		linuxOpenInNewTab,
		windowsLabel,
		windowsHref,
		windowsOpenInNewTab,
		editMode,
	});

export const heroConfig = {
	label: "Hero",
	defaultProps,
	fields,
	metadata,
	render: renderHero,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<HeroProps>;

export const componentConfig = heroConfig;
