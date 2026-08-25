import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export type {
	ContainerAlignment,
	ContainerMaxWidth,
	ContainerPadding,
	ContainerProps,
	ContainerViewProps,
} from "./Container";
export { Container } from "./Container";
export {
	type ContainerAuthorableProps,
	componentConfig,
	containerConfig,
	createComponentConfig,
	createContainerConfig,
	defaultProps,
	defaultProps as containerDefaultProps,
	fields,
	fields as containerFields,
	metadata,
	metadata as containerMetadata,
} from "./config";
export {
	type ContainerMessageKey,
	type CreateComponentConfigOptions,
	containerI18nEntry,
} from "./i18n";
