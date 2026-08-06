import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
export {
	componentConfig,
	createComponentConfig,
	createNavbarConfig,
	defaultProps,
	defaultProps as navbarDefaultProps,
	fields,
	fields as navbarFields,
	metadata,
	metadata as navbarMetadata,
	type NavbarAuthorableProps,
	navbarConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type NavbarItemsAdapter,
	type NavbarMessageKey,
	navbarI18nEntry,
} from "./i18n";
export type {
	NavbarAction,
	NavbarActionSize,
	NavbarActionVariant,
	NavbarActionViewProps,
	NavbarLogoProps,
	NavbarMenuItem,
	NavbarProps,
	NavbarViewProps,
} from "./Navbar";
export { Navbar } from "./Navbar";
