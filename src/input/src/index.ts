import "./styles.css";

export {
	componentConfig,
	createComponentConfig,
	createInputConfig,
	defaultProps,
	defaultProps as inputDefaultProps,
	fields,
	fields as inputFields,
	inputConfig,
	metadata,
	metadata as inputMetadata,
} from "./config";
export type { InputProps, InputViewProps } from "./Input";
export { Input } from "./Input";
export {
	type CreateComponentConfigOptions,
	type InputMessageKey,
	inputI18nEntry,
} from "./i18n";
