# @anvilkit/section

A Puck-native section component scaffold generated for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/section @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/section/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/section/styles.css";
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
