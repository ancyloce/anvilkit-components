import type {
	ComponentConfig,
	ComponentMetadata,
	Fields,
	Slot,
} from "@puckeditor/core";
import { createElement } from "react";
import packageJson from "../package.json";
import type { AccordionProps } from "./Accordion";
import { Accordion } from "./Accordion";
import {
	type AuthorableProps,
	animationField,
	anvilRootAttrs,
	anvilTargetAttrs,
	authoringFields,
	classNamesField,
} from "./authoring";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** One authored panel as it lives in `Data`: a title plus its own slot. */
export interface AccordionItemData {
	title: string;
	content: Slot;
}

/** Authorable shape: business props + the item array + the §5.1 carriers. */
export type AccordionAuthorableProps = AuthorableProps<
	AccordionProps & { items: AccordionItemData[] }
>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of
 * Accordion.tsx: the base-ui `root`, every `item`, and every `trigger`.
 * All three exist in every mode (panels are `keepMounted`).
 *
 * A `content` target is deliberately ABSENT — DOC-01 §5.17 listed one,
 * but `@anvilkit/ui`'s AccordionContent routes `className` to an inner
 * div while spreading other props onto the outer Panel, so no single
 * element can carry both the stamp and the authored class. Fabricating a
 * wrapper to gain the target would violate §8.5. Panel styling is
 * reachable through `item` and through the slot's own children.
 */
const STYLE_TARGET_IDS = ["root", "item", "trigger"] as const;

type AccordionTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Accordion",
	componentSlug: "accordion",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "layout",
	// `root` and `item` are layout boxes; `trigger` is the text-bearing
	// header row, so it is the one granted typography.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Accordion",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"margin",
						"padding",
						"gap",
						"rowGap",
						"direction",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				item: {
					label: "Item",
					responsive: true,
					properties: [
						"display",
						"width",
						"margin",
						"padding",
						"gap",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				trigger: {
					label: "Header",
					responsive: true,
					properties: [
						"display",
						"width",
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
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	items: [
		{ title: "What is included?", content: [] },
		{ title: "How do I get started?", content: [] },
	],
	openMultiple: false,
} satisfies AccordionProps & { items: AccordionItemData[] };

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<AccordionAuthorableProps> {
	return {
		...authoringFields,
		// §3.8: `arrayFields` accepts the full Field union including `slot`.
		items: {
			type: "array",
			label: t("accordion.fields.items.label"),
			defaultItemProps: { title: "Section", content: [] },
			getItemSummary: (item: AccordionItemData, index?: number) =>
				item.title ||
				t("accordion.fields.items.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				title: { type: "text", label: t("accordion.fields.items.title.label") },
				content: {
					type: "slot",
					label: t("accordion.fields.items.content.label"),
				},
			},
		},
		openMultiple: {
			type: "radio",
			label: t("accordion.fields.openMultiple.label"),
			options: [
				{
					label: t("accordion.fields.openMultiple.options.false"),
					value: false,
				},
				{ label: t("accordion.fields.openMultiple.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("accordion.fields.animation.label"),
			preset: t("accordion.fields.animation.preset"),
			presetOptions: {
				none: t("accordion.fields.animation.preset.options.none"),
				"fade-in": t("accordion.fields.animation.preset.options.fade-in"),
				"slide-up": t("accordion.fields.animation.preset.options.slide-up"),
				"slide-down": t("accordion.fields.animation.preset.options.slide-down"),
				"zoom-in": t("accordion.fields.animation.preset.options.zoom-in"),
			},
			duration: t("accordion.fields.animation.duration"),
			delay: t("accordion.fields.animation.delay"),
			easing: t("accordion.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`accordion.targets.${targetId}`),
			})),
			t("accordion.fields.classNames.label"),
		),
	};
}

const renderAccordion: ComponentConfig<AccordionAuthorableProps>["render"] = ({
	id,
	items,
	openMultiple,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Accordion, {
		// Each item's `content` arrives as a slot component; materialize it
		// here so the view stays a pure presentational adapter.
		items: (items ?? []).map((item) => {
			const Content = item.content as unknown as React.ComponentType;
			return { title: item.title, content: createElement(Content) };
		}),
		openMultiple,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			item: anvilTargetAttrs(id, "item"),
			trigger: anvilTargetAttrs(id, "trigger"),
		} satisfies Record<
			Exclude<AccordionTargetId, "root">,
			Record<string, string>
		>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `accordion.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`accordion.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<AccordionAuthorableProps> {
	return {
		label: t("accordion.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderAccordion,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<AccordionAuthorableProps>;

export const accordionConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<AccordionAuthorableProps>;

export const componentConfig = accordionConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<AccordionAuthorableProps> {
	return buildConfig(createT(options));
}

export const createAccordionConfig = createComponentConfig;
