import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Textarea } from './Textarea';
export type { TextareaProps, TextareaViewProps } from './Textarea';
export {
  type TextareaAuthorableProps,
  componentConfig,
  createComponentConfig,
  createTextareaConfig,
  defaultProps,
  fields,
  metadata,
  textareaConfig,
  defaultProps as textareaDefaultProps,
  fields as textareaFields,
  metadata as textareaMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type TextareaMessageKey,
  textareaI18nEntry,
} from './i18n';
