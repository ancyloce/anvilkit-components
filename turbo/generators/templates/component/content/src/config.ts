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
 * `<section>`, the `<h2>` title, and the rich-text `body` container.
 * Add a target only after adding the matching stamp + i18n label.
 */
const STYLE_TARGET_IDS = ['root', 'title', 'body'] as const;

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
      version: '2',
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
            'height',
            'margin',
            'padding',
            'background',
            'border',
            'borderRadius',
            'boxShadow',
            'opacity',
          ],
        },
        title: {
          label: 'Title',
          responsive: true,
          properties: [
            'display',
            'margin',
            'maxWidth',
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
        body: {
          label: 'Body',
          responsive: true,
          properties: [
            'display',
            'margin',
            'maxWidth',
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
  title: '{{componentLabel}}',
  body: '<p>Start editing this content block.</p>',
  alignment: 'left',
} satisfies {{componentName}}Props;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<{{componentName}}AuthorableProps> {
  return {
    ...authoringFields,
    title: {
      type: 'text',
      label: t('{{name}}.fields.title.label'),
    },
    body: {
      type: 'richtext',
      label: t('{{name}}.fields.body.label'),
    },
    alignment: {
      type: 'radio',
      label: t('{{name}}.fields.alignment.label'),
      options: [
        {
          label: t('{{name}}.fields.alignment.options.left'),
          value: 'left',
        },
        {
          label: t('{{name}}.fields.alignment.options.center'),
          value: 'center',
        },
        {
          label: t('{{name}}.fields.alignment.options.right'),
          value: 'right',
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
  title,
  body,
  alignment,
  classNames,
  animation,
  editMode,
}) =>
  createElement({{componentName}}, {
    title,
    body,
    alignment,
    classNames,
    animation,
    editMode,
    // §6.2: stable targets in EVERY mode; the compiler owns CSS.
    rootAttrs: anvilRootAttrs(id),
    targetAttrs: {
      title: anvilTargetAttrs(id, 'title'),
      body: anvilTargetAttrs(id, 'body'),
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
