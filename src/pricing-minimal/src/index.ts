import "./styles.css";

export type {
	AnimationEasing,
	AnimationPreset,
	AnimationProps,
} from "./authoring";
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
	type PricingMinimalAuthorableProps,
	pricingMinimalConfig,
} from "./config";
export {
	type CreateComponentConfigOptions,
	type PricingMinimalMessageKey,
	type PricingMinimalPlansAdapter,
	pricingMinimalI18nEntry,
} from "./i18n";
export {
	type PricingFeature,
	PricingMinimal,
	type PricingMinimalProps,
	type PricingMinimalViewProps,
	type PricingPlan,
} from "./PricingMinimal";
