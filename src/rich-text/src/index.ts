import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createRichTextConfig,
	defaultProps,
	defaultProps as richTextDefaultProps,
	fields,
	fields as richTextFields,
	metadata,
	metadata as richTextMetadata,
	type RichTextAuthorableProps,
	richTextConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type RichTextMessageKey,
	richTextI18nEntry,
} from "./i18n";
export type {
	RichTextAlignment,
	RichTextProps,
	RichTextViewProps,
} from "./RichText";
export { RichText } from "./RichText";
