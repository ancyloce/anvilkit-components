import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createGridConfig,
	defaultProps,
	defaultProps as gridDefaultProps,
	fields,
	fields as gridFields,
	type GridAuthorableProps,
	gridConfig,
	metadata,
	metadata as gridMetadata,
} from "./config";
export type {
	GridAlignment,
	GridColumns,
	GridGap,
	GridProps,
	GridViewProps,
} from "./Grid";
export { Grid } from "./Grid";
export {
	type CreateComponentConfigOptions,
	type GridMessageKey,
	gridI18nEntry,
} from "./i18n";
