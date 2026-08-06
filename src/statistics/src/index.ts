import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createStatisticsConfig,
	defaultProps,
	defaultProps as statisticsDefaultProps,
	fields,
	fields as statisticsFields,
	metadata,
	metadata as statisticsMetadata,
	type StatisticsAuthorableProps,
	statisticsConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type StatisticsMessageKey,
	type StatisticsMetricsAdapter,
	statisticsI18nEntry,
} from "./i18n";
export type {
	StatisticsMetric,
	StatisticsProps,
	StatisticsViewProps,
} from "./Statistics";
export { Statistics } from "./Statistics";
