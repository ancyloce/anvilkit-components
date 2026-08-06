import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createSectionConfig,
	defaultProps,
	defaultProps as sectionDefaultProps,
	fields,
	fields as sectionFields,
	metadata,
	metadata as sectionMetadata,
	type SectionAuthorableProps,
	sectionConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type SectionMessageKey,
	sectionI18nEntry,
} from "./i18n";
export type { SectionProps, SectionViewProps } from "./Section";
export { Section } from "./Section";
