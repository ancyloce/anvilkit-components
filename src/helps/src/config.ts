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
import type { HelpsAvatar, HelpsProps } from "./Helps";
import { Helps } from "./Helps";
import {
	type CreateComponentConfigOptions,
	createT,
	type HelpsAvatarsAdapter,
} from "./i18n";

/**
 * Business props + the §5.1 authoring carriers (PLAN-0025), plus the
 * PLAN-0027 §2.3 data-source props. `dataSource`/`externalData` only
 * gain fields when the host injects an adapter via
 * `createComponentConfig({ dataSources })`; the static config never
 * declares them.
 */
export type HelpsAuthorableProps = AuthorableProps<HelpsProps> & {
	/** §2.3 data-source mode; meaningful only with a host adapter. */
	dataSource?: "static" | "external";
	/** §2.3 external-field selection, stored whole per the Puck contract. */
	externalData?: unknown;
};

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Helps.tsx:
 * root `<section>` → inner `<div>` content column → the message `<p>`,
 * the avatar group container and every avatar instance (one shared
 * `avatar` id), then the actions row and its call-to-action. `button`
 * is stamped on BOTH branches — the interactive `<a>` and the disabled
 * `<BaseButton>` — so edit and production DOM stay identical. The
 * decorative `<Ripple>` is aria-hidden chrome, not an authoring target;
 * the avatar targets disappear only in the empty-collection branch,
 * which by definition renders no avatars.
 */
const STYLE_TARGET_IDS = [
	"root",
	"content",
	"message",
	"avatarGroup",
	"avatar",
	"actions",
	"button",
] as const;

type HelpsTargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
	componentName: "Helps",
	componentSlug: "helps",
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
					label: "Helps",
					responsive: true,
					properties: [
						"display",
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
				content: {
					label: "Content",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				message: {
					label: "Message",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
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
				// `display`/`alignItems` are deliberately NOT granted: the
				// avatar-group primitive sets both as inline styles, which
				// would beat any compiled rule and silently no-op.
				avatarGroup: {
					label: "Avatar group",
					responsive: true,
					properties: [
						"width",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"justifyContent",
						"opacity",
					],
				},
				avatar: {
					label: "Avatar",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
						"opacity",
					],
				},
				actions: {
					label: "Actions",
					responsive: true,
					properties: [
						"display",
						"width",
						"maxWidth",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"opacity",
					],
				},
				button: {
					label: "Button",
					responsive: true,
					properties: [
						"display",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"alignItems",
						"justifyContent",
						"background",
						"border",
						"borderRadius",
						"boxShadow",
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
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	message:
		"We're grateful for the amazing open-source community\nthat helps make our project better every day.",
	buttonLabel: "Become a contributor",
	buttonHref: "/contribute",
	buttonOpenInNewTab: false,
	avatars: [
		{
			name: "Alice Johnson",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "AJ",
		},
		{
			name: "Bob Brown",
			imageUrl:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "BB",
		},
		{
			name: "Charlie Davis",
			imageUrl:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "CD",
		},
		{
			name: "Diana Evans",
			imageUrl:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "DE",
		},
		{
			name: "Ethan Ford",
			imageUrl:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
			initials: "EF",
		},
	],
} satisfies HelpsProps;

type T = ReturnType<typeof createT>;

/** §2.3 fields added only when the host injects an avatars adapter. */
function buildDataSourceFields(
	adapter: HelpsAvatarsAdapter,
	t: T,
): Pick<Fields<HelpsAuthorableProps>, "dataSource" | "externalData"> {
	return {
		dataSource: {
			type: "select",
			label: t("helps.fields.dataSource.label"),
			options: [
				{
					label: t("helps.fields.dataSource.options.static"),
					value: "static",
				},
				{
					label: t("helps.fields.dataSource.options.external"),
					value: "external",
				},
			],
		},
		externalData: {
			type: "external",
			label: t("helps.fields.externalData.label"),
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
): Fields<HelpsAuthorableProps> {
	const adapter = dataSources?.avatars;
	return {
		...authoringFields,
		message: {
			type: "textarea",
			label: t("helps.fields.message.label"),
		},
		buttonLabel: {
			type: "text",
			label: t("helps.fields.buttonLabel.label"),
		},
		buttonHref: {
			type: "text",
			label: t("helps.fields.buttonHref.label"),
		},
		buttonOpenInNewTab: {
			type: "radio",
			label: t("helps.fields.buttonOpenInNewTab.label"),
			options: [
				{
					label: t("helps.fields.buttonOpenInNewTab.options.false"),
					value: false,
				},
				{
					label: t("helps.fields.buttonOpenInNewTab.options.true"),
					value: true,
				},
			],
		},
		avatars: {
			type: "array",
			label: t("helps.fields.avatars.label"),
			defaultItemProps: {
				name: "New contributor",
				imageUrl: "",
				initials: "NC",
			},
			getItemSummary: (item, index) =>
				item.name ||
				t("helps.fields.avatars.itemSummary").replace(
					"{index}",
					String((index ?? 0) + 1),
				),
			arrayFields: {
				name: {
					type: "text",
					label: t("helps.fields.avatars.name.label"),
				},
				imageUrl: {
					type: "text",
					label: t("helps.fields.avatars.imageUrl.label"),
				},
				initials: {
					type: "text",
					label: t("helps.fields.avatars.initials.label"),
				},
			},
		},
		...(adapter ? buildDataSourceFields(adapter, t) : {}),
		animation: animationField({
			label: t("helps.fields.animation.label"),
			preset: t("helps.fields.animation.preset"),
			presetOptions: {
				none: t("helps.fields.animation.preset.options.none"),
				"fade-in": t("helps.fields.animation.preset.options.fade-in"),
				"slide-up": t("helps.fields.animation.preset.options.slide-up"),
				"slide-down": t("helps.fields.animation.preset.options.slide-down"),
				"zoom-in": t("helps.fields.animation.preset.options.zoom-in"),
			},
			duration: t("helps.fields.animation.duration"),
			delay: t("helps.fields.animation.delay"),
			easing: t("helps.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`helps.targets.${targetId}`),
			})),
			t("helps.fields.classNames.label"),
		),
	};
}

/**
 * PLAN-0027 §2.3 resolveData (Puck docs hybrid pattern): reacts only to
 * `dataSource`/`externalData` changes (the docs' `changed` guard), maps
 * the stored external selection into `avatars` via the adapter's
 * `mapItem`, and marks the static `avatars` array read-only while
 * external mode is active. Exists only when a host adapter is injected.
 */
function buildResolveData(
	adapter: HelpsAvatarsAdapter,
): NonNullable<ComponentConfig<HelpsAuthorableProps>["resolveData"]> {
	return ({ props }, { changed }) => {
		if (!changed.dataSource && !changed.externalData) {
			return { props: {} };
		}
		if (props.dataSource !== "external") {
			return { props: {}, readOnly: { avatars: false } };
		}
		if (props.externalData == null) {
			// External mode with nothing selected yet: keep the authored
			// avatars visible but locked until a selection lands.
			return { props: {}, readOnly: { avatars: true } };
		}
		const items = Array.isArray(props.externalData)
			? props.externalData
			: [props.externalData];
		const mapItem = adapter.mapItem ?? ((item: unknown) => item as HelpsAvatar);
		return {
			props: { avatars: items.map(mapItem) },
			readOnly: { avatars: true },
		};
	};
}

const renderHelps: ComponentConfig<HelpsAuthorableProps>["render"] = ({
	id,
	message,
	buttonLabel,
	buttonHref,
	buttonOpenInNewTab,
	avatars,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Helps, {
		message,
		buttonLabel,
		buttonHref,
		buttonOpenInNewTab,
		avatars,
		classNames,
		animation,
		editMode,
		// §6.2: stable targets in EVERY mode; the compiler owns CSS.
		rootAttrs: anvilRootAttrs(id),
		targetAttrs: {
			content: anvilTargetAttrs(id, "content"),
			message: anvilTargetAttrs(id, "message"),
			avatarGroup: anvilTargetAttrs(id, "avatarGroup"),
			avatar: anvilTargetAttrs(id, "avatar"),
			actions: anvilTargetAttrs(id, "actions"),
			button: anvilTargetAttrs(id, "button"),
		} satisfies Record<Exclude<HelpsTargetId, "root">, Record<string, string>>,
	});

function buildConfig(
	t: T,
	dataSources?: CreateComponentConfigOptions["dataSources"],
): ComponentConfig<HelpsAuthorableProps> {
	const config: ComponentConfig<HelpsAuthorableProps> = {
		label: t("helps.label"),
		defaultProps,
		fields: buildFields(t, dataSources),
		metadata,
		render: renderHelps,
	};
	const adapter = dataSources?.avatars;
	if (adapter) {
		config.resolveData = buildResolveData(adapter);
	}
	return config;
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<HelpsAuthorableProps>;

export const helpsConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<HelpsAuthorableProps>;

export const componentConfig = helpsConfig;

/**
 * Build a locale-aware config. Per-key fallback: messages → locale pack
 * → en. With `options.dataSources.avatars` present the config gains the
 * §2.3 `dataSource`/`externalData` fields and `resolveData`; without it
 * the output is byte-compatible with `componentConfig`.
 */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<HelpsAuthorableProps> {
	return buildConfig(createT(options), options?.dataSources);
}

export const createHelpsConfig = createComponentConfig;
