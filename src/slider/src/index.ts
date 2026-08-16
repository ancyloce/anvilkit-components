import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Slider } from './Slider';
export type { SliderProps, SliderViewProps } from './Slider';
export {
  type SliderAuthorableProps,
  componentConfig,
  createComponentConfig,
  createSliderConfig,
  defaultProps,
  fields,
  metadata,
  sliderConfig,
  defaultProps as sliderDefaultProps,
  fields as sliderFields,
  metadata as sliderMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type SliderMessageKey,
  sliderI18nEntry,
} from './i18n';
