import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { BlogListProps } from "./BlogList";
import { BlogList } from "./BlogList";

const defaultPreviewImageSrc =
	"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80";

export const metadata = {
	componentName: "BlogList",
	componentSlug: "blog-list",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
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

export const fields = {
	posts: {
		type: "array",
		label: "Posts",
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
		getItemSummary: (item, index) => item.title || `Post ${(index ?? 0) + 1}`,
		arrayFields: {
			title: {
				type: "text",
				label: "Title",
			},
			description: {
				type: "textarea",
				label: "Description",
			},
			href: {
				type: "text",
				label: "Href",
			},
			openInNewTab: {
				type: "radio",
				label: "Open in new tab",
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
			imageSrc: {
				type: "text",
				label: "Image URL",
			},
			imageAlt: {
				type: "text",
				label: "Image alt text",
			},
			publishedAt: {
				type: "text",
				label: "Published ISO date",
			},
			publishedLabel: {
				type: "text",
				label: "Published date label",
			},
			relativeLabel: {
				type: "text",
				label: "Relative label",
			},
		},
	},
} satisfies Fields<BlogListProps>;

const renderBlogList: ComponentConfig<BlogListProps>["render"] = ({
	posts,
	editMode,
}) =>
	createElement(BlogList, {
		posts,
		editMode,
	});

export const blogListConfig = {
	label: "Blog List",
	defaultProps,
	fields,
	metadata,
	render: renderBlogList,
	// resolveFields: async () => fields,
	// resolveData: async (data) => data,
} satisfies ComponentConfig<BlogListProps>;

export const componentConfig = blogListConfig;
