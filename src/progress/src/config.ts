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
	authoringFields,
	classNamesField,
} from "./authoring";
import { type CreateComponentConfigOptions, createT } from "./i18n";
import type { ProgressProps } from "./Progress";
import { Progress } from "./Progress";

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type ProgressAuthorableProps = AuthorableProps<ProgressProps>;

/**
 * PLAN-0027 §2.1 target map, derived from the REAL DOM of Progress.tsx:
 * the wrapper renders the base-ui progress root and nothing of its own.
 * Track and Indicator are upstream-internal parts the wrapper never
 * stamps, so `root` is the whole map (§8.5).
 */
const STYLE_TARGET_IDS = ["root"] as const;

export const metadata = {
	componentName: "Progress",
	componentSlug: "progress",
	packageName: packageJson.name,
	packageVersion: packageJson.version,
	scaffoldType: "content",
	schemaVersion: 1,
	suggestedCategory: "display",
	// The root is the flex-wrap container that holds the optional label /
	// value text plus the track, so it carries box vocabulary and the
	// typography that cascades to those text parts.
	anvilkit: {
		editor: {
			styleTargets: {
				root: {
					label: "Progress",
					responsive: true,
					properties: [
						"display",
						"position",
						"width",
						"minWidth",
						"maxWidth",
						"height",
						"margin",
						"padding",
						"gap",
						"rowGap",
						"columnGap",
						"alignItems",
						"justifyContent",
						"wrap",
						"opacity",
						"color",
						"fontFamily",
						"fontSize",
						"fontWeight",
						"lineHeight",
						"letterSpacing",
					],
				},
			},
			interactions: true,
			bindings: true,
		},
	},
} satisfies ComponentMetadata;

export const defaultProps = {
	value: 60,
	label: "",
	showValue: false,
} satisfies ProgressProps;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<ProgressAuthorableProps> {
	return {
		...authoringFields,
		value: {
			type: "number",
			label: t("progress.fields.value.label"),
			min: 0,
			max: 100,
		},
		label: {
			type: "text",
			label: t("progress.fields.label.label"),
		},
		showValue: {
			type: "radio",
			label: t("progress.fields.showValue.label"),
			options: [
				{ label: t("progress.fields.showValue.options.false"), value: false },
				{ label: t("progress.fields.showValue.options.true"), value: true },
			],
		},
		animation: animationField({
			label: t("progress.fields.animation.label"),
			preset: t("progress.fields.animation.preset"),
			presetOptions: {
				none: t("progress.fields.animation.preset.options.none"),
				"fade-in": t("progress.fields.animation.preset.options.fade-in"),
				"slide-up": t("progress.fields.animation.preset.options.slide-up"),
				"slide-down": t("progress.fields.animation.preset.options.slide-down"),
				"zoom-in": t("progress.fields.animation.preset.options.zoom-in"),
			},
			duration: t("progress.fields.animation.duration"),
			delay: t("progress.fields.animation.delay"),
			easing: t("progress.fields.animation.easing"),
		}),
		// §2.2: grouped last in the field list.
		classNames: classNamesField(
			STYLE_TARGET_IDS.map((targetId) => ({
				id: targetId,
				label: t(`progress.targets.${targetId}`),
			})),
			t("progress.fields.classNames.label"),
		),
	};
}

const renderProgress: ComponentConfig<ProgressAuthorableProps>["render"] = ({
	id,
	value,
	label,
	showValue,
	classNames,
	animation,
	editMode,
}) =>
	createElement(Progress, {
		value,
		label,
		showValue,
		classNames,
		animation,
		editMode,
		// §6.2/§6.3: the official render emits stable targets; the shared
		// compiler owns CSS materialization — never inline styles here.
		rootAttrs: anvilRootAttrs(id),
	});

/**
 * Locale-aware copy of {@link metadata}: rebuilds every style target's
 * `label` through `t()` using the same `progress.targets.<id>` keys the
 * `classNames` field already consumes. Target **ids** are the data
 * contract and never change here — only the human-readable label.
 */
function buildMetadata(t: T): typeof metadata {
	const { editor } = metadata.anvilkit;
	const styleTargets = { ...editor.styleTargets };
	for (const targetId of STYLE_TARGET_IDS) {
		styleTargets[targetId] = {
			...styleTargets[targetId],
			label: t(`progress.targets.${targetId}`),
		};
	}
	return {
		...metadata,
		anvilkit: { ...metadata.anvilkit, editor: { ...editor, styleTargets } },
	};
}

function buildConfig(t: T): ComponentConfig<ProgressAuthorableProps> {
	return {
		label: t("progress.label"),
		defaultProps,
		fields: buildFields(t),
		metadata: buildMetadata(t),
		render: renderProgress,
	};
}

const defaultT = createT();

export const fields = buildFields(
	defaultT,
) satisfies Fields<ProgressAuthorableProps>;

export const progressConfig = buildConfig(
	defaultT,
) satisfies ComponentConfig<ProgressAuthorableProps>;

export const componentConfig = progressConfig;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
	options?: CreateComponentConfigOptions,
): ComponentConfig<ProgressAuthorableProps> {
	return buildConfig(createT(options));
}

export const createProgressConfig = createComponentConfig;
