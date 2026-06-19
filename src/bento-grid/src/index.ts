import "./styles.css";

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
export { BentoCard } from "./BentoCard";
export { BentoGrid } from "./BentoGrid";
export { BentoGridExample } from "./BentoGridExample";
export { bentoGridExampleItems } from "./data";
export {
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
export {
	type BentoGridMessageKey,
	bentoGridI18nEntry,
	type CreateComponentConfigOptions,
} from "./i18n";
