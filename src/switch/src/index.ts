import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Switch } from './Switch';
export type { SwitchProps, SwitchViewProps } from './Switch';
export {
  type SwitchAuthorableProps,
  componentConfig,
  createComponentConfig,
  createSwitchConfig,
  defaultProps,
  fields,
  metadata,
  switchConfig,
  defaultProps as switchDefaultProps,
  fields as switchFields,
  metadata as switchMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type SwitchMessageKey,
  switchI18nEntry,
} from './i18n';
