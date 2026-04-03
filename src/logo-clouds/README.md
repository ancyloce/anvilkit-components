# @anvilkit/logo-clouds

A Puck-native logo cloud component with a shimmering heading and a scrolling Devicon logo marquee.

## Install

```sh
pnpm add @anvilkit/logo-clouds @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/logo-clouds/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/logo-clouds/styles.css";
import type { Config } from "@puckeditor/core";
import {
  LogoClouds,
  componentConfig,
  defaultProps,
  type LogoCloudsProps,
} from "@anvilkit/logo-clouds";

const config: Config<{
  LogoClouds: LogoCloudsProps;
}> = {
  components: {
    LogoClouds: componentConfig,
  },
};

const data = {
  root: {},
  content: [
    {
      type: "LogoClouds",
      props: {
        id: "logo-clouds-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return (
    <LogoClouds
      title="Brands love us"
      subtitle="Trusted by the teams building polished, high-performance products for the modern web."
    />
  );
}
```
