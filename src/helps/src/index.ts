import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createHelpsConfig,
	defaultProps,
	defaultProps as helpsDefaultProps,
	fields,
	fields as helpsFields,
	type HelpsAuthorableProps,
	helpsConfig,
	metadata,
	metadata as helpsMetadata,
} from "./config";
export type { HelpsAvatar, HelpsProps, HelpsViewProps } from "./Helps";
export { Helps } from "./Helps";
export {
	type CreateComponentConfigOptions,
	type HelpsAvatarsAdapter,
	type HelpsMessageKey,
	helpsI18nEntry,
} from "./i18n";
