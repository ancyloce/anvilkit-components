import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Accordion } from './Accordion';
export type { AccordionProps, AccordionViewProps } from './Accordion';
export {
  type AccordionAuthorableProps,
  componentConfig,
  createComponentConfig,
  createAccordionConfig,
  defaultProps,
  fields,
  metadata,
  accordionConfig,
  defaultProps as accordionDefaultProps,
  fields as accordionFields,
  metadata as accordionMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type AccordionMessageKey,
  accordionI18nEntry,
} from './i18n';
