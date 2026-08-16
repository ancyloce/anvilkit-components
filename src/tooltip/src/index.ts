import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Tooltip } from './Tooltip';
export type { TooltipProps, TooltipViewProps } from './Tooltip';
export {
  type TooltipAuthorableProps,
  componentConfig,
  createComponentConfig,
  createTooltipConfig,
  defaultProps,
  fields,
  metadata,
  tooltipConfig,
  defaultProps as tooltipDefaultProps,
  fields as tooltipFields,
  metadata as tooltipMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type TooltipMessageKey,
  tooltipI18nEntry,
} from './i18n';
