import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { DesignBlockProps } from "./DesignBlock";
import { DesignBlock } from "./DesignBlock";

export const metadata = {
	componentName: "DesignBlock",
	componentSlug: "design-block",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "layout",
} satisfies ComponentMetadata;

export const defaultProps = {
	designId: "",
	previewUrl: "",
	previewAssetId: "",
	artboardId: "",
	alt: "Canvas design preview",
	aspectRatio: "auto",
} satisfies DesignBlockProps;

export const fields = {
	designId: {
		type: "text",
		label: "Design ID",
	},
	previewUrl: {
		type: "text",
		label: "Preview URL",
	},
	previewAssetId: {
		type: "text",
		label: "Preview asset id",
	},
	artboardId: {
		type: "text",
		label: "Artboard ID",
	},
	alt: {
		type: "text",
		label: "Alt text",
	},
	aspectRatio: {
		type: "radio",
		label: "Aspect ratio",
		options: [
			{ label: "Auto", value: "auto" },
			{ label: "16:9", value: "16/9" },
			{ label: "4:3", value: "4/3" },
			{ label: "1:1", value: "1/1" },
		],
	},
} satisfies Fields<DesignBlockProps>;

const renderDesignBlock: ComponentConfig<DesignBlockProps>["render"] = ({
	designId,
	previewUrl,
	previewAssetId,
	artboardId,
	alt,
	aspectRatio,
	editMode,
}) =>
	createElement(DesignBlock, {
		designId,
		previewUrl,
		previewAssetId,
		artboardId,
		alt,
		aspectRatio,
		editMode,
	});

export const designBlockConfig = {
	label: "Design Block",
	defaultProps,
	fields,
	metadata,
	render: renderDesignBlock,
} satisfies ComponentConfig<DesignBlockProps>;

export const componentConfig = designBlockConfig;
