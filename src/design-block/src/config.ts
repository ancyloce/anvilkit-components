import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import { listArtboards } from "./artboard-catalog";
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

const artboardIdTextField = {
	type: "text",
	label: "Artboard ID",
} as const;

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
	artboardId: artboardIdTextField,
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

/**
 * Swap the `artboardId` field between a select (when a host catalog is
 * available for the current designId) and a plain text input (when it
 * is not). Keeps the public field name stable; only the inspector UX
 * changes.
 *
 * The type is derived from Puck's `ComponentConfig<DesignBlockProps>["resolveFields"]`
 * so a future Puck signature change surfaces here at typecheck time. The
 * `params` arg is intentionally unused — this callback only consults
 * `data.props.designId` and the module-singleton artboard catalog.
 */
const resolveDesignBlockFields: NonNullable<
	ComponentConfig<DesignBlockProps>["resolveFields"]
> = (data, _params) => {
	const designId = data.props?.designId ?? "";
	const artboards = listArtboards(designId);
	if (artboards.length === 0) {
		return fields;
	}
	const selectOptions = artboards.map((entry) => ({
		label: entry.label ?? entry.id,
		value: entry.id,
	}));
	return {
		...fields,
		artboardId: {
			type: "select",
			label: "Artboard",
			options: selectOptions,
		},
	};
};

export const designBlockConfig = {
	label: "Design Block",
	defaultProps,
	fields,
	metadata,
	render: renderDesignBlock,
	resolveFields: resolveDesignBlockFields,
} satisfies ComponentConfig<DesignBlockProps>;

export const componentConfig = designBlockConfig;
