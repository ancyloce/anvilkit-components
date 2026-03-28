import type {
  ComponentConfig,
  ComponentMetadata,
  Fields,
} from '@puckeditor/core';
import { createElement } from 'react';
import packageJson from '../package.json';
import { {{componentName}} } from './{{componentName}}';
import type { {{componentName}}Props } from './{{componentName}}';

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

export const fields = {
  title: {
    type: 'text',
    label: 'Title',
  },
  body: {
    type: 'richtext',
    label: 'Body',
  },
  alignment: {
    type: 'radio',
    label: 'Alignment',
    options: [
      {
        label: 'Left',
        value: 'left',
      },
      {
        label: 'Center',
        value: 'center',
      },
      {
        label: 'Right',
        value: 'right',
      },
    ],
  },
} satisfies Fields<{{componentName}}Props>;

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

export const {{componentVarName}}Config = {
  label: '{{componentLabel}}',
  defaultProps,
  fields,
  metadata,
  render: render{{componentName}},
  // resolveFields: async () => fields,
  // resolveData: async (data) => data,
} satisfies ComponentConfig<{{componentName}}Props>;

export const componentConfig = {{componentVarName}}Config;
