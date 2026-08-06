import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createHeroConfig,
	defaultProps,
	defaultProps as heroDefaultProps,
	fields,
	fields as heroFields,
	heroConfig,
	metadata,
	metadata as heroMetadata,
} from "./config";
export type { HeroProps, HeroViewProps } from "./Hero";
export { Hero } from "./Hero";
export {
	type CreateComponentConfigOptions,
	type HeroMessageKey,
	heroI18nEntry,
} from "./i18n";
