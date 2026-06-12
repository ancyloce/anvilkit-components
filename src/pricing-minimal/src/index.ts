import "./styles.css";

export {
	componentConfig,
	createComponentConfig,
	createPricingMinimalConfig,
	defaultProps,
	defaultProps as pricingMinimalDefaultProps,
	fields,
	fields as pricingMinimalFields,
	metadata,
	metadata as pricingMinimalMetadata,
	pricingMinimalConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type PricingMinimalMessageKey,
	pricingMinimalI18nEntry,
} from "./i18n";
export {
	type PricingFeature,
	PricingMinimal,
	type PricingMinimalProps,
	type PricingMinimalViewProps,
	type PricingPlan,
} from "./PricingMinimal";
