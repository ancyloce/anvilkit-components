import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type { CodeLanguage, CodeProps, CodeViewProps } from "./Code";
export { Code } from "./Code";
export {
	type CodeAuthorableProps,
	codeConfig,
	componentConfig,
	createCodeConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as codeDefaultProps,
	fields,
	fields as codeFields,
	metadata,
	metadata as codeMetadata,
} from "./config";
export {
	type CodeMessageKey,
	type CreateComponentConfigOptions,
	codeI18nEntry,
} from "./i18n";
