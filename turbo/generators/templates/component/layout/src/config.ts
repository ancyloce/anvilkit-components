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
  leftColumn: [],
  rightColumn: [],
  emphasis: 'balanced',
} satisfies {{componentName}}Props;

export const fields = {
  title: {
    type: 'text',
    label: 'Title',
  },
  emphasis: {
    type: 'radio',
    label: 'Emphasis',
    options: [
      {
        label: 'Balanced',
        value: 'balanced',
      },
      {
        label: 'Accent',
        value: 'accent',
      },
    ],
  },
  leftColumn: {
    type: 'slot',
    label: 'Left column',
  },
  rightColumn: {
    type: 'slot',
    label: 'Right column',
  },
} satisfies Fields<{{componentName}}Props>;

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
