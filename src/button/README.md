# @anvilkit/button

A Puck-native button block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/button @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/button/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/button/styles.css";
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
