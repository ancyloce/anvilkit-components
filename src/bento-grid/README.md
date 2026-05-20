# @anvilkit/bento-grid

A Puck-native Bento Grid component with adaptive mobile/tablet/desktop layouts, built-in light/dark theming, a serializable `items` API for Puck, and exported `BentoCard` primitives for direct composition.

## Install

```sh
pnpm add @anvilkit/bento-grid @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/bento-grid/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field                     | Type     | Options                                          | Default           |
| ------------------------- | -------- | ------------------------------------------------ | ----------------- |
| `theme`                   | select   | `system`, `light`, `dark`                        | `"dark"`          |
| `platform`                | select   | `adaptive`, `mobile`, `tablet`, `desktop`        | `"adaptive"`      |
| `items`                   | array    | —                                                | _(example items)_ |
| `items[].icon`            | select   | `brain`, `users`, `plug`, `globe`, `code`, `zap` | —                 |
| `items[].title`           | text     | —                                                | —                 |
| `items[].description`     | textarea | —                                                | —                 |
| `items[].size`            | select   | `default`, `wide`, `tall`                        | —                 |
| `items[].rounded`         | radio    | `false`, `true`                                  | —                 |
| `items[].background`      | radio    | `false`, `true`                                  | —                 |
| `items[].ctaLabel`        | text     | —                                                | —                 |
| `items[].ctaHref`         | text     | —                                                | —                 |
| `items[].ctaOpenInNewTab` | radio    | `false`, `true`                                  | —                 |

## Usage

```tsx
import "@anvilkit/bento-grid/styles.css";
import type { Config } from "@puckeditor/core";
import {
  BentoCard,
  BentoGrid,
  BentoGridExample,
  componentConfig,
  defaultProps,
  type BentoGridProps,
} from "@anvilkit/bento-grid";

// Puck config registration
const config: Config<{ BentoGrid: BentoGridProps }> = {
  components: {
    BentoGrid: componentConfig,
  },
};

// Standalone usage with default items
export function PuckExample() {
  return <BentoGrid {...defaultProps} />;
}

// Direct composition with BentoCard primitives
export function DirectCompositionExample() {
  return (
    <BentoGrid theme="light" platform="tablet">
      <BentoCard>
        <h2 className="text-xl font-medium text-card-foreground text-center">
          Custom card
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Use BentoCard for custom cell content.
        </p>
      </BentoCard>
    </BentoGrid>
  );
}

// Pre-built demo
export function Demo() {
  return <BentoGridExample />;
}
```

## Theme & Responsiveness

Supports light and dark themes via the `theme` prop and shadcn CSS variable tokens. The `platform` prop controls layout: `adaptive` automatically switches between mobile, tablet, and desktop grid layouts based on viewport width.
