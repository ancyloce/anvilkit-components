# @anvilkit/section

A Puck-native section component scaffold generated for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/section @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
  Section,
  componentConfig,
  defaultProps,
  type SectionProps,
} from "@anvilkit/section";

const config: Config<{
  Section: SectionProps;
}> = {
  components: {
    Section: componentConfig,
  },
};

const data = {
  root: {},
  content: [
    {
      type: "Section",
      props: {
        id: "section-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return <Section title="Section" body="<p>Start editing this block.</p>" />;
}
```
