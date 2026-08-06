import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { {{componentName}} } from './{{componentName}}';
export type { {{componentName}}Props, {{componentName}}ViewProps } from './{{componentName}}';
export {
  type {{componentName}}AuthorableProps,
  componentConfig,
  createComponentConfig,
  create{{componentName}}Config,
  defaultProps,
  fields,
  metadata,
  {{componentVarName}}Config,
  defaultProps as {{componentVarName}}DefaultProps,
  fields as {{componentVarName}}Fields,
  metadata as {{componentVarName}}Metadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type {{componentName}}MessageKey,
  {{componentVarName}}I18nEntry,
} from './i18n';
