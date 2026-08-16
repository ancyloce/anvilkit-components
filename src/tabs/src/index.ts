import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Tabs } from './Tabs';
export type { TabsProps, TabsViewProps } from './Tabs';
export {
  type TabsAuthorableProps,
  componentConfig,
  createComponentConfig,
  createTabsConfig,
  defaultProps,
  fields,
  metadata,
  tabsConfig,
  defaultProps as tabsDefaultProps,
  fields as tabsFields,
  metadata as tabsMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type TabsMessageKey,
  tabsI18nEntry,
} from './i18n';
