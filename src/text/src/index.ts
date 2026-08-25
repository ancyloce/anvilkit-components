import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createTextConfig,
	defaultProps,
	defaultProps as textDefaultProps,
	fields,
	fields as textFields,
	metadata,
	metadata as textMetadata,
	type TextAuthorableProps,
	textConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type TextMessageKey,
	textI18nEntry,
} from "./i18n";
export type {
	TextAlignment,
	TextProps,
	TextVariant,
	TextViewProps,
} from "./Text";
export { Text } from "./Text";
