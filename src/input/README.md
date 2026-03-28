# @anvilkit/input

A Puck-native input block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/input @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  Input,
  componentConfig,
  defaultProps,
  type InputProps,
} from "@anvilkit/input";

const config: Config<{
  Input: InputProps;
}> = {
  components: {
    Input: componentConfig,
  },
};

export const data = {
  root: {},
  content: [
    {
      type: "Input",
      props: {
        id: "input-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <Input label="Email address" name="email" placeholder="Email address" />;
}
```
