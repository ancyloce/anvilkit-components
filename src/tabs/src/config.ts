import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
	Slot,
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
import { listVariantOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { TabsOrientation, TabsProps } from "./Tabs";
import { Tabs } from "./Tabs";

/** One authored tab as it lives in `Data`: a label plus its own slot. */
export interface TabsItem {
	label: string;
	content: Slot;
}

/** Authorable shape: business props + the item array + the §5.1 carriers. */
export type TabsAuthorableProps = AuthorableProps<
	TabsProps & { items: TabsItem[] }
>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Tabs.tsx: the
 * base-ui `root`, the `list`, every `trigger`, and every `content`
 * panel. Panels are `keepMounted`, so all four exist in every mode.
 */
const STYLE_TARGET_IDS = ["root", "list", "trigger", "content"] as const;

type TabsTargetId = (typeof STYLE_TARGET_IDS)[number];

const ORIENTATION_VALUES: readonly TabsOrientation[] = [
	"horizontal",
	"vertical",
];

export const metadata = {
	componentName: "Tabs",
	componentSlug: "tabs",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	// `root` and `list` are layout boxes; `trigger` is the text-bearing tab
	// label (typography granted); `content` is the panel region that hosts
	// the slot, so it gets box vocabulary plus cascading typography.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Tabs",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"minHeight",
						"maxHeight",
						"margin",
						"padding",
						"gap",
						"rowGap",
						"columnGap",
						"alignItems",
						"justifyContent",
						"direction",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				list: {
					label: "Tab list",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"direction",
						"wrap",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				trigger: {
					label: "Tab",
					responsive: true,
					properties: [
						"display",
						"width",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"background",
						"border",
						"borderRadius",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
						"textAlign",
						"textTransform",
						"cursor",
					],
				},
				content: {
					label: "Panel",
					responsive: true,
					properties: [
						"display",
						"width",
						"minHeight",
						"margin",
						"padding",
						"gap",
						"background",
						"border",
						"borderRadius",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"lineHeight",
						"textAlign",
						"overflow",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	items: [
		{ label: "Overview", content: [] },
		{ label: "Details", content: [] },
	],
	listVariant: "default",
	orientation: "horizontal",
	defaultIndex: 0,
} satisfies TabsProps & { items: TabsItem[] };

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<TabsAuthorableProps> {
	return {
		...authoringFields,
		// §3.8: `arrayFields` accepts the full Field union including `slot`,
		// and Puck 0.23's runtime re-populates nested slot ids on item
		// duplication — verified against the installed dist.
		items: {
			type: "array",
			label: t("tabs.fields.items.label"),
			defaultItemProps: { label: "Tab", content: [] },
			getItemSummary: (item: TabsItem, index?: number) =>
				item.label ||
				t("tabs.fields.items.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				label: { type: "text", label: t("tabs.fields.items.label.label") },
				content: { type: "slot", label: t("tabs.fields.items.content.label") },
			},
		},
		// Codegen output guarded by `check:fields-drift` (FR-003).
		listVariant: {
			type: "radio",
			label: t("tabs.fields.listVariant.label"),
			options: listVariantOptions.map((value) => ({
				label: t(`tabs.fields.listVariant.options.${value}`),
				value,
			})),
		},
		orientation: {
			type: "radio",
			label: t("tabs.fields.orientation.label"),
			options: ORIENTATION_VALUES.map((value) => ({
				label: t(`tabs.fields.orientation.options.${value}`),
				value,
			})),
		},
		defaultIndex: {
			type: "number",
			label: t("tabs.fields.defaultIndex.label"),
			min: 0,
		},
		animation: animationField({
			label: t("tabs.fields.animation.label"),
			preset: t("tabs.fields.animation.preset"),
			presetOptions: {
				none: t("tabs.fields.animation.preset.options.none"),
				"fade-in": t("tabs.fields.animation.preset.options.fade-in"),
				"slide-up": t("tabs.fields.animation.preset.options.slide-up"),
				"slide-down": t("tabs.fields.animation.preset.options.slide-down"),
				"zoom-in": t("tabs.fields.animation.preset.options.zoom-in"),
			},
			duration: t("tabs.fields.animation.duration"),
			delay: t("tabs.fields.animation.delay"),
			easing: t("tabs.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`tabs.targets.${targetId}`),
			})),
			t("tabs.fields.classNames.label"),
		),
	};
}

const renderTabs: ComponentConfig<TabsAuthorableProps>["render"] = ({
	id,
	items,
	listVariant,
	orientation,
	defaultIndex,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Tabs, {
		// Each item's `content` arrives as a slot component; materialize it
		// here so the view stays a pure presentational adapter.
		items: (items ?? []).map((item) => {
			const Content = item.content as unknown as React.ComponentType;
			return { label: item.label, content: createElement(Content) };
		}),
		listVariant,
		orientation,
		defaultIndex,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			list: anvilTargetAttrs(id, "list"),
			trigger: anvilTargetAttrs(id, "trigger"),
			content: anvilTargetAttrs(id, "content"),
		} satisfies Record<Exclude<TabsTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `tabs.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`tabs.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<TabsAuthorableProps> {
	return {
		label: t("tabs.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderTabs,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<TabsAuthorableProps>;

export const tabsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<TabsAuthorableProps>;

export const componentConfig = tabsConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<TabsAuthorableProps> {
	return buildConfig(createT(options));
}

export const createTabsConfig = createComponentConfig;
