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

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field   | Type | Default        |
| ------- | ---- | -------------- |
| `title` | text | `"Statistics"` |

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

// Puck config registration
const config: Config<{ Statistics: StatisticsProps }> = {
  components: {
    Statistics: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return <Statistics title="Our Impact" />;
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
