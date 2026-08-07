import type {
  ComponentConfig,
  ComponentMetadata,
  Fields,
} from '@puckeditor/core';
import { createElement } from 'react';
import packageJson from '../package.json';
import {
  type AuthorableProps,
  animationField,
  anvilRootAttrs,
  anvilTargetAttrs,
  authoringFields,
  classNamesField,
} from './authoring';
import { {{componentName}} } from './{{componentName}}';
import type { {{componentName}}Props } from './{{componentName}}';
import { type CreateComponentConfigOptions, createT } from './i18n';

/** Business props + the §5.1 authoring carriers (PLAN-0025). */
export type {{componentName}}AuthorableProps = AuthorableProps<{{componentName}}Props>;

/**
 * PLAN-0027 §2.1 target map — derive it from the REAL DOM of
 * `{{componentName}}.tsx`: every id here MUST be stamped with
 * `anvilTargetAttrs` on an element that renders in EVERY branch, and
 * every stamped element must appear here. The scaffold ships the root
 * `<label>`, the caption `<span>` and the `<input>` control. The
 * helper text is deliberately NOT a target — it renders only when
 * `helperText` is non-empty, and §2.1 forbids branch-conditional
 * targets.
 */
const STYLE_TARGET_IDS = ['root', 'label', 'control'] as const;

type {{componentName}}TargetId = (typeof STYLE_TARGET_IDS)[number];

export const metadata = {
  componentName: '{{componentName}}',
  componentSlug: '{{name}}',
  packageName: packageJson.name,
  packageVersion: packageJson.version,
  scaffoldType: '{{scaffoldType}}',
  schemaVersion: 1,
{{#if suggestedCategory}}
  suggestedCategory: '{{suggestedCategory}}',
{{/if}}
  // PLAN-0025 metadata v2 (§6.1/§6.5) + PLAN-0027 §2.1 per-element
  // targets. Allowlists use only the grantable §6.1 vocabulary;
  // typography properties are granted on text-bearing targets only.
  anvilkit: {
    editor: {
      styleTargets: {
        root: {
          label: '{{componentLabel}}',
          responsive: true,
          properties: [
            'display',
            'gap',
            'alignItems',
            'justifyContent',
            'width',
            'minWidth',
            'maxWidth',
            'margin',
            'padding',
            'background',
            'border',
            'borderRadius',
            'boxShadow',
            'opacity',
          ],
        },
        label: {
          label: 'Label',
          responsive: true,
          properties: [
            'display',
            'margin',
            'opacity',
            'color',
            'fontFamily',
            'fontSize',
            'fontWeight',
            'lineHeight',
            'letterSpacing',
            'textAlign',
          ],
        },
        control: {
          label: 'Control',
          responsive: true,
          properties: [
            'display',
            'width',
            'minWidth',
            'maxWidth',
            'height',
            'margin',
            'padding',
            'background',
            'border',
            'borderRadius',
            'boxShadow',
            'opacity',
            'color',
            'fontFamily',
            'fontSize',
            'fontWeight',
            'lineHeight',
            'letterSpacing',
            'textAlign',
          ],
        },
      },
      interactions: true,
      bindings: true,
    },
  },
} satisfies ComponentMetadata;

export const defaultProps = {
  label: '{{componentLabel}}',
  name: '{{name}}',
  type: 'text',
  placeholder: 'Enter a value',
  helperText: 'Add guidance for this field.',
  defaultValue: '',
  required: false,
  disabled: false,
} satisfies {{componentName}}Props;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<{{componentName}}AuthorableProps> {
  return {
    ...authoringFields,
    label: {
      type: 'text',
      label: t('{{name}}.fields.label.label'),
    },
    name: {
      type: 'text',
      label: t('{{name}}.fields.name.label'),
    },
    type: {
      type: 'select',
      label: t('{{name}}.fields.type.label'),
      options: [
        {
          label: t('{{name}}.fields.type.options.text'),
          value: 'text',
        },
        {
          label: t('{{name}}.fields.type.options.email'),
          value: 'email',
        },
        {
          label: t('{{name}}.fields.type.options.password'),
          value: 'password',
        },
        {
          label: t('{{name}}.fields.type.options.search'),
          value: 'search',
        },
        {
          label: t('{{name}}.fields.type.options.tel'),
          value: 'tel',
        },
        {
          label: t('{{name}}.fields.type.options.url'),
          value: 'url',
        },
      ],
    },
    placeholder: {
      type: 'text',
      label: t('{{name}}.fields.placeholder.label'),
    },
    helperText: {
      type: 'textarea',
      label: t('{{name}}.fields.helperText.label'),
    },
    defaultValue: {
      type: 'text',
      label: t('{{name}}.fields.defaultValue.label'),
    },
    required: {
      type: 'radio',
      label: t('{{name}}.fields.required.label'),
      options: [
        {
          label: t('{{name}}.fields.required.options.false'),
          value: false,
        },
        {
          label: t('{{name}}.fields.required.options.true'),
          value: true,
        },
      ],
    },
    disabled: {
      type: 'radio',
      label: t('{{name}}.fields.disabled.label'),
      options: [
        {
          label: t('{{name}}.fields.disabled.options.false'),
          value: false,
        },
        {
          label: t('{{name}}.fields.disabled.options.true'),
          value: true,
        },
      ],
    },
    animation: animationField({
      label: t('{{name}}.fields.animation.label'),
      preset: t('{{name}}.fields.animation.preset'),
      presetOptions: {
        none: t('{{name}}.fields.animation.preset.options.none'),
        'fade-in': t('{{name}}.fields.animation.preset.options.fade-in'),
        'slide-up': t('{{name}}.fields.animation.preset.options.slide-up'),
        'slide-down': t('{{name}}.fields.animation.preset.options.slide-down'),
        'zoom-in': t('{{name}}.fields.animation.preset.options.zoom-in'),
      },
      duration: t('{{name}}.fields.animation.duration'),
      delay: t('{{name}}.fields.animation.delay'),
      easing: t('{{name}}.fields.animation.easing'),
    }),
    // §2.2: grouped last in the field list.
    classNames: classNamesField(
      STYLE_TARGET_IDS.map((targetId) => ({
        id: targetId,
        label: t(`{{name}}.targets.${targetId}`),
      })),
      t('{{name}}.fields.classNames.label'),
    ),
  };
}

const render{{componentName}}: ComponentConfig<{{componentName}}AuthorableProps>['render'] = ({
  id,
  label,
  name,
  type,
  placeholder,
  helperText,
  defaultValue,
  required,
  disabled,
  classNames,
  animation,
  editMode,
}) =>
  createElement({{componentName}}, {
    label,
    name,
    type,
    placeholder,
    helperText,
    defaultValue,
    required,
    disabled,
    classNames,
    animation,
    editMode,
    // §6.2: stable targets in EVERY mode; the compiler owns CSS.
    rootAttrs: anvilRootAttrs(id),
    targetAttrs: {
      label: anvilTargetAttrs(id, 'label'),
      control: anvilTargetAttrs(id, 'control'),
    } satisfies Record<
      Exclude<{{componentName}}TargetId, 'root'>,
      Record<string, string>
    >,
  });

function buildConfig(t: T): ComponentConfig<{{componentName}}AuthorableProps> {
  return {
    label: t('{{name}}.label'),
    defaultProps,
    fields: buildFields(t),
    metadata,
    render: render{{componentName}},
    // resolveFields: async () => fields,
    // resolveData: async (data) => data,
  };
}

const defaultT = createT();

export const fields = buildFields(defaultT) satisfies Fields<{{componentName}}AuthorableProps>;

export const {{componentVarName}}Config = buildConfig(defaultT) satisfies ComponentConfig<{{componentName}}AuthorableProps>;

export const componentConfig = {{componentVarName}}Config;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
  options?: CreateComponentConfigOptions,
): ComponentConfig<{{componentName}}AuthorableProps> {
  return buildConfig(createT(options));
}

export const create{{componentName}}Config = createComponentConfig;
