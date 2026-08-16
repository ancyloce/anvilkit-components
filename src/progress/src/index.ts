import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Progress } from './Progress';
export type { ProgressProps, ProgressViewProps } from './Progress';
export {
  type ProgressAuthorableProps,
  componentConfig,
  createComponentConfig,
  createProgressConfig,
  defaultProps,
  fields,
  metadata,
  progressConfig,
  defaultProps as progressDefaultProps,
  fields as progressFields,
  metadata as progressMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type ProgressMessageKey,
  progressI18nEntry,
} from './i18n';
