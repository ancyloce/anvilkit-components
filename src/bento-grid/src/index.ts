import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export { BentoCard } from "./BentoCard";
export { BentoGrid } from "./BentoGrid";
export { BentoGridExample } from "./BentoGridExample";
export {
	type BentoGridAuthorableProps,
	bentoGridConfig,
	componentConfig,
	createBentoGridConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as bentoGridDefaultProps,
	fields,
	fields as bentoGridFields,
	metadata,
	metadata as bentoGridMetadata,
} from "./config";
export { bentoGridExampleItems } from "./data";
export {
	type BentoGridItemsAdapter,
	type BentoGridMessageKey,
	bentoGridI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
export type {
	BentoCardProps,
	BentoCardSize,
	BentoGridIcon,
	BentoGridItem,
	BentoGridPlatform,
	BentoGridProps,
	BentoGridTheme,
	BentoGridViewProps,
} from "./types";
