import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createSeparatorConfig,
	defaultProps,
	defaultProps as separatorDefaultProps,
	fields,
	fields as separatorFields,
	metadata,
	metadata as separatorMetadata,
	type SeparatorAuthorableProps,
	separatorConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type SeparatorMessageKey,
	separatorI18nEntry,
} from "./i18n";
export type { SeparatorProps, SeparatorViewProps } from "./Separator";
export { Separator } from "./Separator";
