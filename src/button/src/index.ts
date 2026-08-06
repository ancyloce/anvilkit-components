import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type { ButtonProps, ButtonViewProps } from "./Button";
export { Button } from "./Button";
export {
	type ButtonAuthorableProps,
	buttonConfig,
	componentConfig,
	createButtonConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as buttonDefaultProps,
	fields,
	fields as buttonFields,
	metadata,
	metadata as buttonMetadata,
} from "./config";
export {
	type ButtonMessageKey,
	buttonI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
