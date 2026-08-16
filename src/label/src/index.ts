import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Label } from './Label';
export type { LabelProps, LabelViewProps } from './Label';
export {
  type LabelAuthorableProps,
  componentConfig,
  createComponentConfig,
  createLabelConfig,
  defaultProps,
  fields,
  metadata,
  labelConfig,
  defaultProps as labelDefaultProps,
  fields as labelFields,
  metadata as labelMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type LabelMessageKey,
  labelI18nEntry,
} from './i18n';
