# @anvilkit/logo-clouds

A Puck-native logo cloud component with a shimmering heading and a scrolling Devicon logo marquee.

## Install

```sh
pnpm add @anvilkit/logo-clouds @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
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
