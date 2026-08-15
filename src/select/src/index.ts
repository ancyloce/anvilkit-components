import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createSelectConfig,
	defaultProps,
	defaultProps as selectDefaultProps,
	fields,
	fields as selectFields,
	metadata,
	metadata as selectMetadata,
	type SelectAuthorableProps,
	selectConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type SelectMessageKey,
	selectI18nEntry,
} from "./i18n";
export type { SelectOption, SelectProps, SelectViewProps } from "./Select";
export { Select } from "./Select";
