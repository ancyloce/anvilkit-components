import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createImageConfig,
	defaultProps,
	defaultProps as imageDefaultProps,
	fields,
	fields as imageFields,
	type ImageAuthorableProps,
	imageConfig,
	metadata,
	metadata as imageMetadata,
} from "./config";
export type {
	ImageAspectRatio,
	ImageObjectFit,
	ImageProps,
	ImageViewProps,
} from "./Image";
export { Image } from "./Image";
export {
	type CreateComponentConfigOptions,
	type ImageMessageKey,
	imageI18nEntry,
} from "./i18n";
