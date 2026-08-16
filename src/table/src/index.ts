import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Table } from './Table';
export type { TableProps, TableViewProps } from './Table';
export {
  type TableAuthorableProps,
  componentConfig,
  createComponentConfig,
  createTableConfig,
  defaultProps,
  fields,
  metadata,
  tableConfig,
  defaultProps as tableDefaultProps,
  fields as tableFields,
  metadata as tableMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type TableMessageKey,
  tableI18nEntry,
} from './i18n';
