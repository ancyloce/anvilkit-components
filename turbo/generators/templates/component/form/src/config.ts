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
  label: '{{componentLabel}}',
  name: '{{name}}',
  type: 'text',
  placeholder: 'Enter a value',
  helperText: 'Add guidance for this field.',
  defaultValue: '',
  required: false,
  disabled: false,
} satisfies {{componentName}}Props;

export const fields = {
  label: {
    type: 'text',
    label: 'Label',
  },
  name: {
    type: 'text',
    label: 'Name',
  },
  type: {
    type: 'select',
    label: 'Type',
    options: [
      {
        label: 'Text',
        value: 'text',
      },
      {
        label: 'Email',
        value: 'email',
      },
      {
        label: 'Password',
        value: 'password',
      },
      {
        label: 'Search',
        value: 'search',
      },
      {
        label: 'Telephone',
        value: 'tel',
      },
      {
        label: 'URL',
        value: 'url',
      },
    ],
  },
  placeholder: {
    type: 'text',
    label: 'Placeholder',
  },
  helperText: {
    type: 'textarea',
    label: 'Helper text',
  },
  defaultValue: {
    type: 'text',
    label: 'Default value',
  },
  required: {
    type: 'radio',
    label: 'Required',
    options: [
      {
        label: 'No',
        value: false,
      },
      {
        label: 'Yes',
        value: true,
      },
    ],
  },
  disabled: {
    type: 'radio',
    label: 'Disabled',
    options: [
      {
        label: 'No',
        value: false,
      },
      {
        label: 'Yes',
        value: true,
      },
    ],
  },
} satisfies Fields<{{componentName}}Props>;

const render{{componentName}}: ComponentConfig<{{componentName}}Props>['render'] = ({
  label,
  name,
  type,
  placeholder,
  helperText,
  defaultValue,
  required,
  disabled,
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
