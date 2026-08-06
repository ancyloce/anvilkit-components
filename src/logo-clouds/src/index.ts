import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createLogoCloudsConfig,
	defaultProps,
	defaultProps as logoCloudsDefaultProps,
	fields,
	fields as logoCloudsFields,
	type LogoCloudsAuthorableProps,
	logoCloudsConfig,
	metadata,
	metadata as logoCloudsMetadata,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type LogoCloudsMessageKey,
	logoCloudsI18nEntry,
} from "./i18n";
export type { LogoCloudsProps, LogoCloudsViewProps } from "./LogoClouds";
export { LogoClouds } from "./LogoClouds";
