# @anvilkit/button

A Puck-native button block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/button @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  Button,
  componentConfig,
  defaultProps,
  type ButtonProps,
} from "@anvilkit/button";

const config: Config<{
  Button: ButtonProps;
}> = {
  components: {
    Button: componentConfig,
  },
};

export const data = {
  root: {},
  content: [
    {
      type: "Button",
      props: {
        id: "button-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <Button label="Save changes" variant="primary" />;
}
```
