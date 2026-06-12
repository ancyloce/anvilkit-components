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
  leftColumn: [],
  rightColumn: [],
  emphasis: 'balanced',
} satisfies {{componentName}}Props;

type T = ReturnType<typeof createT>;

function buildFields(t: T): Fields<{{componentName}}Props> {
  return {
    title: {
      type: 'text',
      label: t('{{name}}.fields.title.label'),
    },
    emphasis: {
      type: 'radio',
      label: t('{{name}}.fields.emphasis.label'),
      options: [
        {
          label: t('{{name}}.fields.emphasis.options.balanced'),
          value: 'balanced',
        },
        {
          label: t('{{name}}.fields.emphasis.options.accent'),
          value: 'accent',
        },
      ],
    },
    leftColumn: {
      type: 'slot',
      label: t('{{name}}.fields.leftColumn.label'),
    },
    rightColumn: {
      type: 'slot',
      label: t('{{name}}.fields.rightColumn.label'),
    },
  };
}

const render{{componentName}}: ComponentConfig<{{componentName}}Props>['render'] = ({
  title,
  emphasis,
  leftColumn: LeftColumn,
  rightColumn: RightColumn,
  editMode,
}) =>
  createElement({{componentName}}, {
    title,
    emphasis,
    leftColumn: createElement(LeftColumn),
    rightColumn: createElement(RightColumn),
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
