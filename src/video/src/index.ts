import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createVideoConfig,
	defaultProps,
	defaultProps as videoDefaultProps,
	fields,
	fields as videoFields,
	metadata,
	metadata as videoMetadata,
	type VideoAuthorableProps,
	videoConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type VideoMessageKey,
	videoI18nEntry,
} from "./i18n";
export type { VideoAspectRatio, VideoProps, VideoViewProps } from "./Video";
export { Video } from "./Video";
