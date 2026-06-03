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

## Examples

### Basic usage

Render the header with a custom uppercase `title` over the animated grid.

```tsx
import "@anvilkit/statistics/styles.css";
import { Statistics } from "@anvilkit/statistics";

export function Example() {
  return <Statistics title="Our Impact" />;
}
```

### Default copy

Render the bundled default title via `defaultProps`.

```tsx
import { Statistics, defaultProps } from "@anvilkit/statistics";

export function DefaultStatistics() {
  return <Statistics {...defaultProps} />;
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type StatisticsProps } from "@anvilkit/statistics";

const config: Config<{ Statistics: StatisticsProps }> = {
  components: {
    Statistics: componentConfig,
  },
};
```

## API

Derived from the exported `StatisticsProps` type and the Puck `fields` schema.

| Prop    | Type     | Default        | Description                  |
| ------- | -------- | -------------- | ---------------------------- |
| `title` | `string` | `"Statistics"` | Uppercase header title text. |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
