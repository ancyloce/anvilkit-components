# @anvilkit/section

A Puck-native section component with badge, headline, highlighted text, and description.

## Install

```sh
pnpm add @anvilkit/section @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/section/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field | Type | Default |
|-------|------|---------|
| `badgeLabel` | text | `"Scale"` |
| `headline` | text | `"Stop writing boilerplate."` |
| `highlightedHeadline` | text | `"Start building features."` |
| `description` | textarea | `"Your AI agent handles repetitive coding tasks..."` |

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

// Puck config registration
const config: Config<{ Section: SectionProps }> = {
  components: {
    Section: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return (
    <Section
      badgeLabel="Scale"
      headline="Stop writing boilerplate."
      highlightedHeadline="Start building features."
      description="Your AI agent handles repetitive coding tasks."
    />
  );
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
