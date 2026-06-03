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

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Examples

### Basic usage

Render the section with its default copy via `defaultProps`.

```tsx
import "@anvilkit/logo-clouds/styles.css";
import { LogoClouds, defaultProps } from "@anvilkit/logo-clouds";

export function Example() {
  return <LogoClouds {...defaultProps} />;
}
```

### Custom heading and subtitle

The shimmering heading is driven by `title`; `subtitle` renders the supporting
copy beneath it. The scrolling logo marquee is built in.

```tsx
import { LogoClouds } from "@anvilkit/logo-clouds";

export function TrustedBy() {
  return (
    <LogoClouds
      title="Trusted by builders"
      subtitle="Teams of every size ship polished products with our stack."
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type LogoCloudsProps } from "@anvilkit/logo-clouds";

const config: Config<{ LogoClouds: LogoCloudsProps }> = {
  components: {
    LogoClouds: componentConfig,
  },
};
```

## API

Derived from the exported `LogoCloudsProps` type and the Puck `fields` schema.

| Prop       | Type     | Default             | Description                        |
| ---------- | -------- | ------------------- | ---------------------------------- |
| `title`    | `string` | `"Brands love us"`  | Shimmering heading text.           |
| `subtitle` | `string` | _(trusted-by copy)_ | Supporting copy below the heading. |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
