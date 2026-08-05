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
	anvilTargetAttrs,
	authoringFields,
} from "./authoring";
import { listArtboards } from "./artboard-catalog";
import type { DesignBlockProps } from "./DesignBlock";
import { DesignBlock } from "./DesignBlock";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type DesignBlockAuthorableProps = AuthorableProps<DesignBlockProps>;

export const metadata = {
	componentName: "DesignBlock",
	componentSlug: "design-block",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "layout",
	// PLAN-0025 metadata v2 (§6.1/§6.5): ONLY explicitly safe size/
	// background properties — the design canvas is an arbitrary-content
	// surface with its own protocol; granting broad CSS here is
	// explicitly prohibited ("never grant all CSS by default").
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Design block",
					responsive: true,
					properties: [
						"width",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
					],
				},
				canvas: {
					label: "Canvas",
					responsive: true,
					properties: ["width", "height", "borderRadius", "opacity"],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
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

function buildFields(t: T): Fields<DesignBlockAuthorableProps> {
	return {
		...authoringFields,
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

const renderDesignBlock: ComponentConfig<
	DesignBlockAuthorableProps
>["render"] = ({
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
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: { canvas: anvilTargetAttrs(id, "canvas") },
	});

function buildConfig(t: T): ComponentConfig<DesignBlockAuthorableProps> {
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

export const fields = buildFields(
	defaultT,
) satisfies Fields<DesignBlockAuthorableProps>;

export const designBlockConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<DesignBlockAuthorableProps>;

export const componentConfig = designBlockConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<DesignBlockAuthorableProps> {
	return buildConfig(createT(options));
}

export const createDesignBlockConfig = createComponentConfig;
