import "./styles.css";

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
	statisticsConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type StatisticsMessageKey,
	statisticsI18nEntry,
} from "./i18n";
export type { StatisticsProps, StatisticsViewProps } from "./Statistics";
export { Statistics } from "./Statistics";
