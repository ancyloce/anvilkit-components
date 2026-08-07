import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import {
	type CreateComponentConfigOptions,
	createT,
	type StatisticsMetricsAdapter,
} from "./i18n";
import type { StatisticsMetric, StatisticsProps } from "./Statistics";
import { Statistics } from "./Statistics";

/**
 * Business props + the §5.1 authoring carriers (PLAN-0025), plus the
 * PLAN-0027 §2.3 data-source props. The pre-existing `dataSource`
 * business prop ("static" | "remote_csv") is reconciled here into the
 * §2.3 adapter-injected select ("static" | "external"): the component
 * never read it (the F11 remote-CSV path keys off the reserved
 * `_dataSource` IR directive, not this prop), so `dataSource`/
 * `externalData` only gain fields when the host injects an adapter via
 * `createComponentConfig({ dataSources })`; the static config never
 * declares them.
 */
export type StatisticsAuthorableProps = AuthorableProps<StatisticsProps> & {
	/** §2.3 data-source mode; meaningful only with a host adapter. */
	dataSource?: "static" | "external";
	/** §2.3 external-field selection, stored whole per the Puck contract. */
	externalData?: unknown;
};

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of
 * Statistics.tsx: the root `<section>` wraps the title `<h2>` and the
 * metrics grid; every metric instance stamps `item` on its container
 * plus `value`/`label` on its two text spans. With `metrics` empty the
 * item/value/label targets have no instances by definition (the same
 * discipline as blog-list's empty state); the decorative gradient and
 * flickering grid are presentation-only and deliberately untargeted.
 */
const STYLE_TARGET_IDS = ["root", "title", "item", "value", "label"] as const;

type StatisticsTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Statistics",
	componentSlug: "statistics",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "marketing",
	// PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
	// targets. Allowlists use only the grantable §6.1 vocabulary;
	// typography properties are granted on text-bearing targets only.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Statistics",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				title: {
					label: "Title",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
				item: {
					label: "Stat item",
					responsive: true,
					properties: [
						"display",
						"gap",
						"alignItems",
						"justifyContent",
						"height",
						"padding",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				value: {
					label: "Value",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
				label: {
					label: "Label",
					responsive: true,
					properties: [
						"display",
						"margin",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
					],
				},
			},
			inlineText: [{ id: "title", propPath: "title", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	title: "Statistics",
	metrics: [
		{ label: "Active users", value: "1.2M" },
		{ label: "Countries", value: "40+" },
		{ label: "Uptime", value: "99.99%" },
		{ label: "Requests per day", value: "3B" },
	],
} satisfies StatisticsProps;

type T = ReturnType<typeof createT>;

/** §2.3 fields added only when the host injects a metrics adapter. */
function buildDataSourceFields(
	adapter: StatisticsMetricsAdapter,
	t: T,
): Pick<Fields<StatisticsAuthorableProps>, "dataSource" | "externalData"> {
	return {
		dataSource: {
			type: "select",
			label: t("statistics.fields.dataSource.label"),
			options: [
				{
					label: t("statistics.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("statistics.fields.dataSource.options.external"),
					value: "external",
				},
			],
		},
		externalData: {
			type: "external",
			label: t("statistics.fields.externalData.label"),
			// The adapter deliberately takes no query params; the field
			// stores the selection whole and resolveData maps it (§2.3).
			fetchList: () => adapter.fetchList(),
			showSearch: adapter.showSearch,
			...(adapter.getItemSummary
				? { getItemSummary: adapter.getItemSummary }
				: {}),
		},
	};
}

function buildFields(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): Fields<StatisticsAuthorableProps> {
	const adapter = dataSources?.metrics;
	return {
		...authoringFields,
		title: {
			type: "text",
			label: t("statistics.fields.title.label"),
		},
		metrics: {
			type: "array",
			label: t("statistics.fields.metrics.label"),
			defaultItemProps: {
				label: "New metric",
				value: "0",
			},
			getItemSummary: (item, index) =>
				item.label ||
				t("statistics.fields.metrics.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				label: {
					type: "text",
					label: t("statistics.fields.metrics.fields.label.label"),
				},
				value: {
					type: "text",
					label: t("statistics.fields.metrics.fields.value.label"),
				},
			},
		},
		...(adapter ? buildDataSourceFields(adapter, t) : {}),
		animation: animationField({
			label: t("statistics.fields.animation.label"),
			preset: t("statistics.fields.animation.preset"),
			presetOptions: {
				none: t("statistics.fields.animation.preset.options.none"),
				"fade-in": t("statistics.fields.animation.preset.options.fade-in"),
				"slide-up": t("statistics.fields.animation.preset.options.slide-up"),
				"slide-down": t(
					"statistics.fields.animation.preset.options.slide-down",
				),
				"zoom-in": t("statistics.fields.animation.preset.options.zoom-in"),
			},
			duration: t("statistics.fields.animation.duration"),
			delay: t("statistics.fields.animation.delay"),
			easing: t("statistics.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`statistics.targets.${targetId}`),
			})),
			t("statistics.fields.classNames.label"),
		),
	};
}

/**
 * PLAN-0027 §2.3 resolveData (Puck docs hybrid pattern): reacts only to
 * `dataSource`/`externalData` changes (the docs' `changed` guard), maps
 * the stored external selection into `metrics` via the adapter's
 * `mapItem`, and marks the static `metrics` array read-only while
 * external mode is active. Exists only when a host adapter is injected.
 */
function buildResolveData(
	adapter: StatisticsMetricsAdapter,
): NonNullable<ComponentConfig<StatisticsAuthorableProps>["resolveData"]> {
	return ({ props }, { changed }) => {
		if (!changed.dataSource && !changed.externalData) {
			return { props: {} };
		}
		if (props.dataSource !== "external") {
			return { props: {}, readOnly: { metrics: false } };
		}
		if (props.externalData == null) {
			// External mode with nothing selected yet: keep the authored
			// metrics visible but locked until a selection lands.
			return { props: {}, readOnly: { metrics: true } };
		}
		const items = Array.isArray(props.externalData)
			? props.externalData
			: [props.externalData];
		const mapItem =
			adapter.mapItem ?? ((item: unknown) => item as StatisticsMetric);
		return {
			props: { metrics: items.map(mapItem) },
			readOnly: { metrics: true },
		};
	};
}

const renderStatistics: ComponentConfig<StatisticsAuthorableProps>["render"] =
	({ id, title, metrics, classNames, animation, editMode }) =>
		createElement(Statistics, {
			title,
			metrics,
			classNames,
			animation,
			editMode,
			// §6.2: stable targets in EVERY mode; the compiler owns CSS.
			rootAttrs: anvilRootAttrs(id),
			targetAttrs: {
				title: anvilTargetAttrs(id, "title"),
				item: anvilTargetAttrs(id, "item"),
				value: anvilTargetAttrs(id, "value"),
				label: anvilTargetAttrs(id, "label"),
			} satisfies Record<
				Exclude<StatisticsTargetId, "root">,
				Record<string, string>
			>,
		});

function buildConfig(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): ComponentConfig<StatisticsAuthorableProps> {
	const config: ComponentConfig<StatisticsAuthorableProps> = {
		label: t("statistics.label"),
		defaultProps,
		fields: buildFields(t, dataSources),
		metadata,
		render: renderStatistics,
	};
	const adapter = dataSources?.metrics;
	if (adapter) {
		config.resolveData = buildResolveData(adapter);
	}
	return config;
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<StatisticsAuthorableProps>;

export const statisticsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<StatisticsAuthorableProps>;

export const componentConfig = statisticsConfig;

/**
 * Build a locale-aware config. Per-key fallback: messages → locale pack
 * → en. With `options.dataSources.metrics` present the config gains the
 * §2.3 `dataSource`/`externalData` fields and `resolveData`; without it
 * the output is byte-compatible with `componentConfig`.
 */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<StatisticsAuthorableProps> {
	return buildConfig(createT(options), options?.dataSources);
}

export const createStatisticsConfig = createComponentConfig;
