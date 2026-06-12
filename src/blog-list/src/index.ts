import "./styles.css";

export type {
	BlogListPost,
	BlogListProps,
	BlogListViewProps,
} from "./BlogList";
export { BlogList } from "./BlogList";
export {
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
	blogListI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
