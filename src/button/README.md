# @anvilkit/button

A Puck-native button block with variant and link support.

## Install

```sh
pnpm add @anvilkit/button @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/button/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field | Type | Options | Default |
|-------|------|---------|---------|
| `label` | text | — | `"Save changes"` |
| `variant` | radio | `primary`, `secondary` | `"primary"` |
| `href` | text | — | `""` |
| `openInNewTab` | radio | `false`, `true` | `false` |
| `disabled` | radio | `false`, `true` | `false` |

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

// Puck config registration
const config: Config<{ Button: ButtonProps }> = {
  components: {
    Button: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return <Button label="Save changes" variant="primary" />;
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
