/**
 * Puck-native authoring surface (PLAN-0025 §5.3/§6.2) — self-contained
 * per package, like `i18n.ts`: component packages deliberately take no
 * `@anvilkit/core`/`@anvilkit/contracts` dependency, so the hidden
 * authoring fields and target-attribute helpers live here verbatim.
 * The workspace suite `tests/authoring-contract.test.ts` locks every
 * package's copy to one structural shape and to the exact attribute
 * literals the AnvilKit compiler selects on — divergence fails CI, so
 * self-containment cannot drift into incompatible variants.
 *
 * The authoring carriers are `unknown`-typed here on purpose: the
 * component never reads them (the shared compiler owns CSS
 * materialization), and the authoritative types/schemas live in
 * `@anvilkit/contracts` + `@anvilkit/schema`, enforced by the Studio
 * write path before anything lands in these props.
 */

import type { CustomField, ObjectField } from '@puckeditor/core';
import { type CSSProperties, createElement, type ReactElement } from 'react';

/** §5.1 node authoring carriers, attached to every authorable component. */
export interface AuthoringFeatureProps {
  readonly appearance?: unknown;
  readonly interactions?: readonly unknown[];
  readonly bindings?: readonly unknown[];
}

/** Business props + the §5.1 authoring carriers. */
export type AuthorableProps<T extends object> = T & AuthoringFeatureProps;

// Puck 0.22.4 erratum (locked upstream): `CustomFieldRender` must
// return a ReactElement, so hidden fields render an empty element.
const renderHidden = (): ReactElement =>
  createElement('span', { hidden: true });

/** Hidden declared field for `props.appearance` (§5.3). */
export const appearanceField: CustomField<unknown> = {
  type: 'custom',
  visible: false,
  render: renderHidden,
};

/** Hidden declared field for `props.interactions` (§5.3). */
export const interactionsField: CustomField<readonly unknown[] | undefined> = {
  type: 'custom',
  visible: false,
  render: renderHidden,
};

/** Hidden declared field for `props.bindings` (§5.3). */
export const bindingsField: CustomField<readonly unknown[] | undefined> = {
  type: 'custom',
  visible: false,
  render: renderHidden,
};

/** The three §5.3 fields, spreadable into a config's `fields`. */
export const authoringFields = {
  appearance: appearanceField,
  interactions: interactionsField,
  bindings: bindingsField,
} as const;

/** Root target attributes (§6.2): stamped on the component's root element. */
export function anvilRootAttrs(id: string, target = 'root') {
  return {
    'data-ak-node': id,
    'data-ak-style-node': id,
    'data-ak-style-target': target,
  } as const;
}

/** Named-target attributes (§6.2): exact pairs, never descendant selectors. */
export function anvilTargetAttrs(id: string, target: string) {
  return {
    'data-ak-style-node': id,
    'data-ak-style-target': target,
  } as const;
}

/** One style-target descriptor consumed by {@link classNamesField} (PLAN-0027 §2.2). */
export interface AuthoringTargetOption {
  readonly id: string;
  readonly label: string;
}

/**
 * PLAN-0027 §2.2 Tailwind passthrough — one `text` sub-field per style
 * target, grouped under a single `object` field (declared last in the
 * field list). Renders merge authored classes AFTER base classes so
 * they win ordering conflicts; a class only takes effect when the host
 * page's compiled CSS contains it (stated limitation, app-scope
 * follow-up).
 */
export function classNamesField(
  targets: readonly AuthoringTargetOption[],
  label?: string,
): ObjectField<Record<string, string>> {
  const objectFields: ObjectField<Record<string, string>>['objectFields'] = {};
  for (const target of targets) {
    objectFields[target.id] = { type: 'text', label: target.label };
  }
  return { type: 'object', label, objectFields };
}

/** PLAN-0027 §2.4 entrance presets; `none` emits no animation attributes. */
export const ANIMATION_PRESETS = [
  'none',
  'fade-in',
  'slide-up',
  'slide-down',
  'zoom-in',
] as const;
export type AnimationPreset = (typeof ANIMATION_PRESETS)[number];

/** §2.4 easing vocabulary — CSS keywords, shown untranslated in the select. */
export const ANIMATION_EASINGS = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
] as const;
export type AnimationEasing = (typeof ANIMATION_EASINGS)[number];

/** §2.4 serializable `animation` prop, carried in declared fields only. */
export interface AnimationProps {
  readonly preset: AnimationPreset;
  readonly durationMs?: number;
  readonly delayMs?: number;
  readonly easing?: AnimationEasing;
}

/** Localized labels for {@link animationField}. */
export interface AnimationFieldLabels {
  readonly label: string;
  readonly preset: string;
  readonly presetOptions: Readonly<Record<AnimationPreset, string>>;
  readonly duration: string;
  readonly delay: string;
  readonly easing: string;
}

/** PLAN-0027 §2.4 `animation` object field: preset/durationMs/delayMs/easing. */
export function animationField(
  labels: AnimationFieldLabels,
): ObjectField<AnimationProps> {
  return {
    type: 'object',
    label: labels.label,
    objectFields: {
      preset: {
        type: 'select',
        label: labels.preset,
        options: ANIMATION_PRESETS.map((preset) => ({
          label: labels.presetOptions[preset],
          value: preset,
        })),
      },
      durationMs: { type: 'number', label: labels.duration, min: 0 },
      delayMs: { type: 'number', label: labels.delay, min: 0 },
      easing: {
        type: 'select',
        label: labels.easing,
        options: ANIMATION_EASINGS.map((easing) => ({
          label: easing,
          value: easing,
        })),
      },
    },
  };
}

/** Root-element application of {@link AnimationProps} (§2.4). */
export interface AnimationAttrs {
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * PLAN-0027 §2.4 — the root class pair (`ak-anim ak-anim-<preset>`)
 * plus runtime-computed custom properties (the styling rules'
 * sanctioned inline-style case). The keyframes live in each package's
 * `styles.css` behind `@media (prefers-reduced-motion: no-preference)`;
 * an unset or `none` preset yields no attributes at all. Entrance
 * animations run in edit mode too — the canvas preview is the point.
 */
export function animationAttrs(animation?: AnimationProps): AnimationAttrs {
  if (!animation?.preset || animation.preset === 'none') return {};
  return {
    className: `ak-anim ak-anim-${animation.preset}`,
    style: {
      '--ak-anim-duration': `${animation.durationMs ?? 500}ms`,
      '--ak-anim-delay': `${animation.delayMs ?? 0}ms`,
      '--ak-anim-easing': animation.easing ?? 'ease',
    } as CSSProperties,
  };
}
