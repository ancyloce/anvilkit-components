import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Checkbox } from './Checkbox';
export type { CheckboxProps, CheckboxViewProps } from './Checkbox';
export {
  type CheckboxAuthorableProps,
  componentConfig,
  createComponentConfig,
  createCheckboxConfig,
  defaultProps,
  fields,
  metadata,
  checkboxConfig,
  defaultProps as checkboxDefaultProps,
  fields as checkboxFields,
  metadata as checkboxMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type CheckboxMessageKey,
  checkboxI18nEntry,
} from './i18n';
