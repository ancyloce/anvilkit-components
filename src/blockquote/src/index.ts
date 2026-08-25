import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type { BlockquoteProps, BlockquoteViewProps } from "./Blockquote";
export { Blockquote } from "./Blockquote";
export {
	type BlockquoteAuthorableProps,
	blockquoteConfig,
	componentConfig,
	createBlockquoteConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as blockquoteDefaultProps,
	fields,
	fields as blockquoteFields,
	metadata,
	metadata as blockquoteMetadata,
} from "./config";
export {
	type BlockquoteMessageKey,
	blockquoteI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
