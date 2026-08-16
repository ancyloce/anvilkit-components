import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Alert } from './Alert';
export type { AlertProps, AlertViewProps } from './Alert';
export {
  type AlertAuthorableProps,
  componentConfig,
  createComponentConfig,
  createAlertConfig,
  defaultProps,
  fields,
  metadata,
  alertConfig,
  defaultProps as alertDefaultProps,
  fields as alertFields,
  metadata as alertMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type AlertMessageKey,
  alertI18nEntry,
} from './i18n';
