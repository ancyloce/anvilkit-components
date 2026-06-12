import './styles.css';

export { {{componentName}} } from './{{componentName}}';
export type { {{componentName}}Props, {{componentName}}ViewProps } from './{{componentName}}';
export {
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
