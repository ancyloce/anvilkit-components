import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createIconConfig,
	defaultProps,
	defaultProps as iconDefaultProps,
	fields,
	fields as iconFields,
	type IconAuthorableProps,
	iconConfig,
	metadata,
	metadata as iconMetadata,
} from "./config";
export type { IconName, IconProps, IconSize, IconViewProps } from "./Icon";
export { Icon } from "./Icon";
export {
	type CreateComponentConfigOptions,
	type IconMessageKey,
	iconI18nEntry,
} from "./i18n";
