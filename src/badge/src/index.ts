import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type { BadgeProps, BadgeViewProps } from "./Badge";
export { Badge } from "./Badge";
export {
	type BadgeAuthorableProps,
	badgeConfig,
	componentConfig,
	createBadgeConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as badgeDefaultProps,
	fields,
	fields as badgeFields,
	metadata,
	metadata as badgeMetadata,
} from "./config";
export {
	type BadgeMessageKey,
	badgeI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
