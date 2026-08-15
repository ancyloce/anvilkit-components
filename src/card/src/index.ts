import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type { CardProps, CardViewProps } from "./Card";
export { Card } from "./Card";
export {
	type CardAuthorableProps,
	cardConfig,
	componentConfig,
	createCardConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as cardDefaultProps,
	fields,
	fields as cardFields,
	metadata,
	metadata as cardMetadata,
} from "./config";
export {
	type CardMessageKey,
	type CreateComponentConfigOptions,
	cardI18nEntry,
} from "./i18n";
