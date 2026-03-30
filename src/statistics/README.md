# @anvilkit/statistics

A Puck-native statistics header component with a flickering grid background.

## Install

```sh
pnpm add @anvilkit/statistics @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
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
