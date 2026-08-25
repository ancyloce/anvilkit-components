import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type {
	ColumnItem,
	ColumnsAlignment,
	ColumnsCollapseAt,
	ColumnsGap,
	ColumnsProps,
	ColumnsViewProps,
	ColumnViewItem,
} from "./Columns";
export { Columns } from "./Columns";
export {
	type ColumnsAuthorableProps,
	columnsConfig,
	componentConfig,
	createColumnsConfig,
	createComponentConfig,
	defaultProps,
	defaultProps as columnsDefaultProps,
	fields,
	fields as columnsFields,
	metadata,
	metadata as columnsMetadata,
} from "./config";
export {
	type ColumnsMessageKey,
	type CreateComponentConfigOptions,
	columnsI18nEntry,
} from "./i18n";
