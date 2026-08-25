import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createSpacerConfig,
	defaultProps,
	defaultProps as spacerDefaultProps,
	fields,
	fields as spacerFields,
	metadata,
	metadata as spacerMetadata,
	type SpacerAuthorableProps,
	spacerConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type SpacerMessageKey,
	spacerI18nEntry,
} from "./i18n";
export type { SpacerProps, SpacerSize, SpacerViewProps } from "./Spacer";
export { Spacer } from "./Spacer";
