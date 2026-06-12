import type {
  ComponentConfig,
  ComponentMetadata,
  Fields,
} from '@puckeditor/core';
import { createElement } from 'react';
import packageJson from '../package.json';
import { {{componentName}} } from './{{componentName}}';
import type { {{componentName}}Props } from './{{componentName}}';
import { type CreateComponentConfigOptions, createT } from './i18n';

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
} satisfies ComponentMetadata;

export const defaultProps = {
  title: '{{componentLabel}}',
  body: '<p>Start editing this content block.</p>',
  alignment: 'left',
} satisfies {{componentName}}Props;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<{{componentName}}Props> {
  return {
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
  };
}

const render{{componentName}}: ComponentConfig<{{componentName}}Props>['render'] = ({
  title,
  body,
  alignment,
  editMode,
}) =>
  createElement({{componentName}}, {
    title,
    body,
    alignment,
    editMode,
  });

function buildConfig(t: T): ComponentConfig<{{componentName}}Props> {
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

export const fields = buildFields(defaultT) satisfies Fields<{{componentName}}Props>;

export const {{componentVarName}}Config = buildConfig(defaultT) satisfies ComponentConfig<{{componentName}}Props>;

export const componentConfig = {{componentVarName}}Config;

/** Build a locale-aware config. Per-key fallback: messages → locale pack → en. */
export function createComponentConfig(
  options?: CreateComponentConfigOptions,
): ComponentConfig<{{componentName}}Props> {
  return buildConfig(createT(options));
}

export const create{{componentName}}Config = createComponentConfig;
