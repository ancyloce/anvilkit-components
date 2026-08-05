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
import type { BlogListProps } from "./BlogList";
import { BlogList } from "./BlogList";
import { type CreateComponentConfigOptions, createT } from "./i18n";

const defaultPreviewImageSrc =
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type BlogListAuthorableProps = AuthorableProps<BlogListProps>;

export const metadata = {
	componentName: "BlogList",
	componentSlug: "blog-list",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5). DEVIATION confirmed against
	// the real DOM: the posts grid IS the root <section> (both render
	// branches), so no separate `list` container exists to target —
	// grid properties are granted at root instead.
	anvilkit: {
		editor: {
			version: "2",
			styleTargets: {
				root: {
					label: "Blog list",
					responsive: true,
					properties: [
						"display",
						"gap",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"opacity",
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

function buildFields(t: T): Fields<BlogListAuthorableProps> {
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
	};
}

const renderBlogList: ComponentConfig<BlogListAuthorableProps>["render"] = ({
	id,
	posts,
	editMode,
}) =>
	createElement(BlogList, {
		posts,
		editMode,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
	});

function buildConfig(t: T): ComponentConfig<BlogListAuthorableProps> {
	return {
		label: t("blog-list.label"),
		defaultProps,
		fields: buildFields(t),
		metadata,
		render: renderBlogList,
		// resolveFields: async () => fields,
		// resolveData: async (data) => data,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<BlogListAuthorableProps>;

export const blogListConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<BlogListAuthorableProps>;

export const componentConfig = blogListConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<BlogListAuthorableProps> {
	return buildConfig(createT(options));
}

export const createBlogListConfig = createComponentConfig;
