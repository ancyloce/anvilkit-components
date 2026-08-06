import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type {
	BlogListPost,
	BlogListProps,
	BlogListViewProps,
} from "./BlogList";
export { BlogList } from "./BlogList";
export {
	type BlogListAuthorableProps,
	blogListConfig,
	componentConfig,
	createBlogListConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as blogListDefaultProps,
	fields,
	fields as blogListFields,
	metadata,
	metadata as blogListMetadata,
} from "./config";
export {
	type BlogListMessageKey,
	type BlogListPostsAdapter,
	blogListI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
