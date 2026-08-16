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
import type { CardProps } from "./Card";
import { Card } from "./Card";
import { sizeOptions } from "./generated/fields.gen";
import { type CreateComponentConfigOptions, createT } from "./i18n";

/** Authorable shape: business props + slots + the §5.1 carriers. */
export type CardAuthorableProps = AuthorableProps<
	CardProps & {
		content: Slot;
		footer: Slot;
	}
>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Card.tsx. Every
 * id maps to an element the render actually produces; `title` and
 * `description` are conditional on their props (allowed — they are real
 * DOM whenever rendered), while the two slot regions always render.
 */
const STYLE_TARGET_IDS = [
	"root",
	"title",
	"description",
	"content",
	"footer",
] as const;

type CardTargetId = (typeof STYLE_TARGET_IDS)[number];

const BOX_PROPERTIES = [
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
	"wrap",
	"background",
	"border",
	"borderRadius",
	"boxShadow",
	"opacity",
	"overflow",
] as const;

const TEXT_PROPERTIES = [
	"color",
	"fontFamily",
	"fontSize",
	"fontWeight",
	"lineHeight",
	"letterSpacing",
	"textAlign",
	"textDecoration",
	"textTransform",
	"textWrap",
] as const;

export const metadata = {
	componentName: "Card",
	componentSlug: "card",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "layout",
	schemaVersion: 1,
	suggestedCategory: "display",
	// `root` is the flex column container; the two text targets add the
	// typography axis on top of the box vocabulary; the slot regions are
	// layout containers, so they take the box vocabulary only. `zIndex`
	// is withheld from `root` — it is the component's outermost element,
	// so its stacking would escape into the page.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Card",
					responsive: true,
					properties: [...BOX_PROPERTIES, "inset"],
				},
				title: {
					label: "Title",
					responsive: true,
					properties: [...BOX_PROPERTIES, ...TEXT_PROPERTIES],
				},
				description: {
					label: "Description",
					responsive: true,
					properties: [...BOX_PROPERTIES, ...TEXT_PROPERTIES],
				},
				content: {
					label: "Content",
					responsive: true,
					properties: [...BOX_PROPERTIES],
				},
				footer: {
					label: "Footer",
					responsive: true,
					properties: [...BOX_PROPERTIES],
				},
			},
			inlineText: [{ id: "title", propPath: "title", format: "plain" }],
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	title: "Card title",
	// Non-empty by default: the authoring-parity suite requires every
	// declared style target to exist in the default DOM, and the
	// description element is conditional on this prop. Authors clearing
	// it still collapses the element (DOC-01 §5.3).
	description: "Card description",
	size: "default",
	content: [],
	footer: [],
} satisfies CardProps & { content: Slot; footer: Slot };

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<CardAuthorableProps> {
	return {
		...authoringFields,
		title: {
			type: "text",
			label: t("card.fields.title.label"),
		},
		description: {
			type: "textarea",
			label: t("card.fields.description.label"),
		},
		// Codegen output guarded by `check:fields-drift` (FR-003).
		size: {
			type: "radio",
			label: t("card.fields.size.label"),
			options: sizeOptions.map((value) => ({
				label: t(`card.fields.size.options.${value}`),
				value,
			})),
		},
		// Slots are the only nesting mechanism (design 0022 §3.3); `allow`
		// stays unset so the full component whitelist can drop in.
		content: {
			type: "slot",
			label: t("card.fields.content.label"),
		},
		footer: {
			type: "slot",
			label: t("card.fields.footer.label"),
		},
		animation: animationField({
			label: t("card.fields.animation.label"),
			preset: t("card.fields.animation.preset"),
			presetOptions: {
				none: t("card.fields.animation.preset.options.none"),
				"fade-in": t("card.fields.animation.preset.options.fade-in"),
				"slide-up": t("card.fields.animation.preset.options.slide-up"),
				"slide-down": t("card.fields.animation.preset.options.slide-down"),
				"zoom-in": t("card.fields.animation.preset.options.zoom-in"),
			},
			duration: t("card.fields.animation.duration"),
			delay: t("card.fields.animation.delay"),
			easing: t("card.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`card.targets.${targetId}`),
			})),
			t("card.fields.classNames.label"),
		),
	};
}

const renderCard: ComponentConfig<CardAuthorableProps>["render"] = ({
	id,
	title,
	description,
	size,
	content: Content,
	footer: Footer,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Card, {
		title,
		description,
		size,
		content: createElement(Content),
		footer: createElement(Footer),
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets in EVERY
		// mode; the shared compiler owns CSS materialization.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			title: anvilTargetAttrs(id, "title"),
			description: anvilTargetAttrs(id, "description"),
			content: anvilTargetAttrs(id, "content"),
			footer: anvilTargetAttrs(id, "footer"),
		} satisfies Record<Exclude<CardTargetId, "root">, Record<string, string>>,
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `card.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const { styleTargets } = editor;
	// Written out per target rather than looped: these five targets grant
	// three different property vocabularies, so an indexed write would
	// widen `properties` to `string[]` and break the literal contract.
	return {
		...metadata,
		anvilkit: {
			...metadata.anvilkit,
			editor: {
				...editor,
				styleTargets: {
					root: { ...styleTargets.root, label: t("card.targets.root") },
					title: { ...styleTargets.title, label: t("card.targets.title") },
					description: {
						...styleTargets.description,
						label: t("card.targets.description"),
					},
					content: {
						...styleTargets.content,
						label: t("card.targets.content"),
					},
					footer: { ...styleTargets.footer, label: t("card.targets.footer") },
				},
			},
		},
	};
}

function buildConfig(t: T): ComponentConfig<CardAuthorableProps> {
	return {
		label: t("card.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderCard,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<CardAuthorableProps>;

export const cardConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<CardAuthorableProps>;

export const componentConfig = cardConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<CardAuthorableProps> {
	return buildConfig(createT(options));
}

export const createCardConfig = createComponentConfig;
