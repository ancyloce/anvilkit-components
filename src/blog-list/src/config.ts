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
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import type { BlogListPost, BlogListProps } from "./BlogList";
import { BlogList } from "./BlogList";
import {
	type BlogListPostsAdapter,
	type CreateComponentConfigOptions,
	createT,
} from "./i18n";

const defaultPreviewImageSrc =
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80";

/**
 * Business props + the §5.1 authoring carriers (PLAN-0025), plus the
 * PLAN-0027 §2.3 data-source props. `dataSource`/`externalData` only
 * gain fields when the host injects an adapter via
 * `createComponentConfig({ dataSources })`; the static config never
 * declares them.
 */
export type BlogListAuthorableProps = AuthorableProps<BlogListProps> & {
	/** §2.3 data-source mode; meaningful only with a host adapter. */
	dataSource?: "static" | "external";
	/** §2.3 external-field selection, stored whole per the Puck contract. */
	externalData?: unknown;
};

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of BlogList.tsx:
 * the posts grid IS the root `<section>` (both render branches — no
 * separate `list` container exists to target); every card instance
 * stamps `card` on its container (both the interactive `<a>` and the
 * static `<div>` branch) plus `cardImage`/`cardMeta`/`cardTitle`/
 * `cardDescription` on the shared card content. The empty state renders
 * root only — it has no cards by definition.
 */
const STYLE_TARGET_IDS = [
	"root",
	"card",
	"cardImage",
	"cardMeta",
	"cardTitle",
	"cardDescription",
] as const;

type BlogListTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "BlogList",
	componentSlug: "blog-list",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Blog list",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				card: {
					label: "Card",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"height",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				cardImage: {
					label: "Card image",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"height",
						"margin",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				cardMeta: {
					label: "Card meta",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
				cardTitle: {
					label: "Card title",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
				cardDescription: {
					label: "Card description",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	posts: [
		{
			title: "How Dev AI?",
			description:
				"Introducing Acme.ai, a cutting-edge AI solution for modern businesses.",
			href: "/blog/how-dev-ai",
			openInNewTab: false,
			imageSrc: defaultPreviewImageSrc,
			imageAlt: "How Dev AI?",
			publishedAt: "2024-11-01",
			publishedLabel: "November 1, 2024",
			relativeLabel: "8mo ago",
		},
		{
			title: "Why Dev AI?",
			description:
				"Introducing Acme.ai, a cutting-edge AI solution for modern businesses.",
			href: "/blog/why-dev-ai",
			openInNewTab: false,
			imageSrc: defaultPreviewImageSrc,
			imageAlt: "Why Dev AI?",
			publishedAt: "2024-11-01",
			publishedLabel: "November 1, 2024",
			relativeLabel: "8mo ago",
		},
		{
			title: "Introducing Acme.ai",
			description:
				"Introducing Acme.ai, a cutting-edge AI solution for modern businesses.",
			href: "/blog/introducing-dev-ai",
			openInNewTab: false,
			imageSrc: defaultPreviewImageSrc,
			imageAlt: "Introducing Acme.ai",
			publishedAt: "2024-08-29",
			publishedLabel: "August 29, 2024",
			relativeLabel: "10mo ago",
		},
	],
} satisfies BlogListProps;

type T = ReturnType<typeof createT>;

/** §2.3 fields added only when the host injects a posts adapter. */
function buildDataSourceFields(
	adapter: BlogListPostsAdapter,
	t: T,
): Pick<Fields<BlogListAuthorableProps>, "dataSource" | "externalData"> {
	return {
		dataSource: {
			type: "select",
			label: t("blog-list.fields.dataSource.label"),
			options: [
				{
					label: t("blog-list.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("blog-list.fields.dataSource.options.external"),
					value: "external",
				},
			],
		},
		externalData: {
			type: "external",
			label: t("blog-list.fields.externalData.label"),
			// The adapter deliberately takes no query params; the field
			// stores the selection whole and resolveData maps it (§2.3).
			fetchList: () => adapter.fetchList(),
			showSearch: adapter.showSearch,
			...(adapter.getItemSummary
				? { getItemSummary: adapter.getItemSummary }
				: {}),
		},
	};
}

function buildFields(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): Fields<BlogListAuthorableProps> {
	const adapter = dataSources?.posts;
	return {
		...authoringFields,
		posts: {
			type: "array",
			label: t("blog-list.fields.posts.label"),
			defaultItemProps: {
				title: "New post",
				description: "Write a short summary for this article.",
				href: "/blog/new-post",
				openInNewTab: false,
				imageSrc: defaultPreviewImageSrc,
				imageAlt: "New post",
				publishedAt: "2024-11-01",
				publishedLabel: "November 1, 2024",
				relativeLabel: "8mo ago",
			},
			getItemSummary: (item, index) =>
				item.title ||
				t("blog-list.fields.posts.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				title: {
					type: "text",
					label: t("blog-list.fields.posts.title.label"),
				},
				description: {
					type: "textarea",
					label: t("blog-list.fields.posts.description.label"),
				},
				href: {
					type: "text",
					label: t("blog-list.fields.posts.href.label"),
				},
				openInNewTab: {
					type: "radio",
					label: t("blog-list.fields.posts.openInNewTab.label"),
					options: [
						{
							label: t("blog-list.fields.posts.openInNewTab.options.false"),
							value: false,
						},
						{
							label: t("blog-list.fields.posts.openInNewTab.options.true"),
							value: true,
						},
					],
				},
				imageSrc: {
					type: "text",
					label: t("blog-list.fields.posts.imageSrc.label"),
				},
				imageAlt: {
					type: "text",
					label: t("blog-list.fields.posts.imageAlt.label"),
				},
				publishedAt: {
					type: "text",
					label: t("blog-list.fields.posts.publishedAt.label"),
				},
				publishedLabel: {
					type: "text",
					label: t("blog-list.fields.posts.publishedLabel.label"),
				},
				relativeLabel: {
					type: "text",
					label: t("blog-list.fields.posts.relativeLabel.label"),
				},
			},
		},
		...(adapter ? buildDataSourceFields(adapter, t) : {}),
		animation: animationField({
			label: t("blog-list.fields.animation.label"),
			preset: t("blog-list.fields.animation.preset"),
			presetOptions: {
				none: t("blog-list.fields.animation.preset.options.none"),
				"fade-in": t("blog-list.fields.animation.preset.options.fade-in"),
				"slide-up": t("blog-list.fields.animation.preset.options.slide-up"),
				"slide-down": t("blog-list.fields.animation.preset.options.slide-down"),
				"zoom-in": t("blog-list.fields.animation.preset.options.zoom-in"),
			},
			duration: t("blog-list.fields.animation.duration"),
			delay: t("blog-list.fields.animation.delay"),
			easing: t("blog-list.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`blog-list.targets.${targetId}`),
			})),
			t("blog-list.fields.classNames.label"),
		),
	};
}

/**
 * PLAN-0027 §2.3 resolveData (Puck docs hybrid pattern): reacts only to
 * `dataSource`/`externalData` changes (the docs' `changed` guard), maps
 * the stored external selection into `posts` via the adapter's
 * `mapItem`, and marks the static `posts` array read-only while
 * external mode is active. Exists only when a host adapter is injected.
 */
function buildResolveData(
	adapter: BlogListPostsAdapter,
): NonNullable<ComponentConfig<BlogListAuthorableProps>["resolveData"]> {
	return ({ props }, { changed }) => {
		if (!changed.dataSource && !changed.externalData) {
			return { props: {} };
		}
		if (props.dataSource !== "external") {
			return { props: {}, readOnly: { posts: false } };
		}
		if (props.externalData == null) {
			// External mode with nothing selected yet: keep the authored
			// posts visible but locked until a selection lands.
			return { props: {}, readOnly: { posts: true } };
		}
		const items = Array.isArray(props.externalData)
			? props.externalData
			: [props.externalData];
		const mapItem =
			adapter.mapItem ?? ((item: unknown) => item as BlogListPost);
		return {
			props: { posts: items.map(mapItem) },
			readOnly: { posts: true },
		};
	};
}

const renderBlogList: ComponentConfig<BlogListAuthorableProps>["render"] = ({
	id,
	posts,
	classNames,
	animation,
	editMode,
}) =>
	createElement(BlogList, {
		posts,
		classNames,
		animation,
		editMode,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			card: anvilTargetAttrs(id, "card"),
			cardImage: anvilTargetAttrs(id, "cardImage"),
			cardMeta: anvilTargetAttrs(id, "cardMeta"),
			cardTitle: anvilTargetAttrs(id, "cardTitle"),
			cardDescription: anvilTargetAttrs(id, "cardDescription"),
		} satisfies Record<
			Exclude<BlogListTargetId, "root">,
			Record<string, string>
		>,
	});

function buildConfig(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): ComponentConfig<BlogListAuthorableProps> {
	const config: ComponentConfig<BlogListAuthorableProps> = {
		label: t("blog-list.label"),
		defaultProps,
		fields: buildFields(t, dataSources),
		metadata,
		render: renderBlogList,
	};
	const adapter = dataSources?.posts;
	if (adapter) {
		config.resolveData = buildResolveData(adapter);
	}
	return config;
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<BlogListAuthorableProps>;

export const blogListConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BlogListAuthorableProps>;

export const componentConfig = blogListConfig;

/**
 * Build a locale-aware config. Per-key fallback: messages → locale pack
 * → en. With `options.dataSources.posts` present the config gains the
 * §2.3 `dataSource`/`externalData` fields and `resolveData`; without it
 * the output is byte-compatible with `componentConfig`.
 */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BlogListAuthorableProps> {
	return buildConfig(createT(options), options?.dataSources);
}

export const createBlogListConfig = createComponentConfig;
