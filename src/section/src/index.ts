import "./styles.css";

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
	sectionConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type SectionMessageKey,
	sectionI18nEntry,
} from "./i18n";
export type { SectionProps, SectionViewProps } from "./Section";
export { Section } from "./Section";
