import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createLinkConfig,
	defaultProps,
	defaultProps as linkDefaultProps,
	fields,
	fields as linkFields,
	type LinkAuthorableProps,
	linkConfig,
	metadata,
	metadata as linkMetadata,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type LinkMessageKey,
	linkI18nEntry,
} from "./i18n";
export type { LinkProps, LinkSize, LinkVariant, LinkViewProps } from "./Link";
export { Link } from "./Link";
