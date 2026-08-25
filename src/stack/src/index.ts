import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createStackConfig,
	defaultProps,
	defaultProps as stackDefaultProps,
	fields,
	fields as stackFields,
	metadata,
	metadata as stackMetadata,
	type StackAuthorableProps,
	stackConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type StackMessageKey,
	stackI18nEntry,
} from "./i18n";
export type {
	StackAlignment,
	StackDirection,
	StackGap,
	StackJustification,
	StackProps,
	StackViewProps,
} from "./Stack";
export { Stack } from "./Stack";
