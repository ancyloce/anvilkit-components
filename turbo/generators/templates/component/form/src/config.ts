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
  // AnvilKit visual-editor capability declaration (contract:
  // `EditorCapabilityMetadata` in `@anvilkit/contracts/editor`).
  // Scaffolded at Level 1 (selectable): "wrapper" needs no render
  // changes. To go further, declare only the capabilities the
  // component honours (Level 2+) and consider `styleTarget: 'root'`
  // with an `editorDataAttributes` spread on the root element — see
  // the "Adopting the visual editor" docs guide and
  // `src/section/src/config.ts` for a worked Level 3 example.
  editor: {
    version: '1',
    styleTarget: 'wrapper',
    capabilities: {},
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

function buildFields(t: T): Fields<{{componentName}}Props> {
  return {
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
  };
}

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
