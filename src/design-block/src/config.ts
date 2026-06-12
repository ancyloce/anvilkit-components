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
import { type CreateComponentConfigOptions, createT } from "./i18n";

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

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<DesignBlockProps> {
	return {
		designId: {
			type: "text",
			label: t("design-block.fields.designId.label"),
		},
		previewUrl: {
			type: "text",
			label: t("design-block.fields.previewUrl.label"),
		},
		previewAssetId: {
			type: "text",
			label: t("design-block.fields.previewAssetId.label"),
		},
		artboardId: {
			type: "text",
			label: t("design-block.fields.artboardId.label"),
		},
		alt: {
			type: "text",
			label: t("design-block.fields.alt.label"),
		},
		aspectRatio: {
			type: "radio",
			label: t("design-block.fields.aspectRatio.label"),
			options: [
				{
					label: t("design-block.fields.aspectRatio.options.auto"),
					value: "auto",
				},
				{
					label: t("design-block.fields.aspectRatio.options.16-9"),
					value: "16/9",
				},
				{
					label: t("design-block.fields.aspectRatio.options.4-3"),
					value: "4/3",
				},
				{
					label: t("design-block.fields.aspectRatio.options.1-1"),
					value: "1/1",
				},
			],
		},
	};
}

const renderDesignBlock: ComponentConfig<DesignBlockProps>["render"] = ({
	designId,
	previewUrl,
	previewAssetId,
	artboardId,
	alt,
	aspectRatio,
	editPromptText,
	unavailableText,
	editPortalLabel,
	editMode,
	// Puck injects the node id into render props (`WithId`); thread it
	// through so the edit-mode open affordance can name the block it opens.
	id,
}) =>
	createElement(DesignBlock, {
		designId,
		previewUrl,
		previewAssetId,
		artboardId,
		alt,
		aspectRatio,
		editPromptText,
		unavailableText,
		editPortalLabel,
		editMode,
		puckNodeId: id,
	});

function buildConfig(t: T): ComponentConfig<DesignBlockProps> {
	const localizedFields = buildFields(t);

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
			return localizedFields;
		}
		const selectOptions = artboards.map((entry) => ({
			label: entry.label ?? entry.id,
			value: entry.id,
		}));
		return {
			...localizedFields,
			artboardId: {
				type: "select",
				label: t("design-block.fields.artboardId.selectLabel"),
				options: selectOptions,
			},
		};
	};

	return {
		label: t("design-block.label"),
		defaultProps: {
			...defaultProps,
			alt: t("design-block.a11y.previewAlt"),
			editPromptText: t("design-block.fallback.editPrompt"),
			unavailableText: t("design-block.fallback.unavailable"),
			editPortalLabel: t("design-block.a11y.editPortal"),
		},
		fields: localizedFields,
		metadata,
		render: renderDesignBlock,
		resolveFields: resolveDesignBlockFields,
	};
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<DesignBlockProps>;

export const designBlockConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<DesignBlockProps>;

export const componentConfig = designBlockConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<DesignBlockProps> {
	return buildConfig(createT(options));
}

export const createDesignBlockConfig = createComponentConfig;
