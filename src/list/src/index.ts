import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createListConfig,
	defaultProps,
	defaultProps as listDefaultProps,
	fields,
	fields as listFields,
	type ListAuthorableProps,
	listConfig,
	metadata,
	metadata as listMetadata,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type ListMessageKey,
	listI18nEntry,
} from "./i18n";
export type {
	ListItem,
	ListProps,
	ListSpacing,
	ListStyle,
	ListViewProps,
} from "./List";
export { List } from "./List";
