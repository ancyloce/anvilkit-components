# @anvilkit/statistics

A Puck-native statistics header component with a flickering grid background.

## Install

```sh
pnpm add @anvilkit/statistics @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/statistics/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/statistics/styles.css";
import type { Config } from "@puckeditor/core";
import {
  Statistics,
  componentConfig,
  defaultProps,
  type StatisticsProps,
} from "@anvilkit/statistics";

const config: Config<{
  Statistics: StatisticsProps;
}> = {
  components: {
    Statistics: componentConfig,
  },
};

const data = {
  root: {},
  content: [
    {
      type: "Statistics",
      props: {
        id: "statistics-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <Statistics title="Statistics" />;
}
```
