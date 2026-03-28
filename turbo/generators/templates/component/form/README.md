# {{packageName}}

A Puck-native form component scaffold generated for `anvilkit-components`.

## Install

```sh
pnpm add {{packageName}} @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  {{componentName}},
  componentConfig,
  defaultProps,
  type {{componentName}}Props,
} from "{{packageName}}";

const config: Config<{
  {{componentName}}: {{componentName}}Props;
}> = {
  components: {
    {{componentName}}: componentConfig,
  },
};

const data = {
  root: {},
  content: [
    {
      type: "{{componentName}}",
      props: {
        id: "{{name}}-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <{{componentName}} label="{{componentLabel}}" name="{{name}}" placeholder="Enter a value" />;
}
```
