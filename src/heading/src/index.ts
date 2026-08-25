import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createHeadingConfig,
	defaultProps,
	defaultProps as headingDefaultProps,
	fields,
	fields as headingFields,
	type HeadingAuthorableProps,
	headingConfig,
	metadata,
	metadata as headingMetadata,
} from "./config";
export type {
	HeadingAlignment,
	HeadingLevel,
	HeadingProps,
	HeadingViewProps,
} from "./Heading";
export { Heading } from "./Heading";
export {
	type CreateComponentConfigOptions,
	type HeadingMessageKey,
	headingI18nEntry,
} from "./i18n";
