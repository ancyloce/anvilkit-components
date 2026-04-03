# @anvilkit/input

A Puck-native input block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/input @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/input/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/input/styles.css";
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
