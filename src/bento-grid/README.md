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

## Examples

### Basic usage

Render the grid with the bundled example cards via `defaultProps`.

```tsx
import "@anvilkit/bento-grid/styles.css";
import { BentoGrid, defaultProps } from "@anvilkit/bento-grid";

export function Example() {
  return <BentoGrid {...defaultProps} />;
}
```

### Theming and direct `BentoCard` composition

Set `theme` and `platform`, and pass `BentoCard` children for full control over
each cell instead of the serializable `items` array.

```tsx
import { BentoCard, BentoGrid } from "@anvilkit/bento-grid";

export function CustomCards() {
  return (
    <BentoGrid theme="light" platform="tablet">
      <BentoCard size="wide">
        <h2 className="text-xl font-medium text-card-foreground">
          Custom card
        </h2>
        <p className="text-sm text-muted-foreground">
          Use BentoCard for fully custom cell content.
        </p>
      </BentoCard>
    </BentoGrid>
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type BentoGridProps } from "@anvilkit/bento-grid";

const config: Config<{ BentoGrid: BentoGridProps }> = {
  components: {
    BentoGrid: componentConfig,
  },
};
```

## API

Derived from the exported `BentoGridProps` type and the Puck `fields` schema.

| Prop                      | Type                                                                   | Default             | Description                |
| ------------------------- | ---------------------------------------------------------------------- | ------------------- | -------------------------- |
| `theme`                   | `"system"` \| `"light"` \| `"dark"`                                    | `"dark"`            | Color theme.               |
| `platform`                | `"adaptive"` \| `"mobile"` \| `"tablet"` \| `"desktop"`                | `"adaptive"`        | Platform layout.           |
| `items`                   | `BentoGridItem[]`                                                      | _(6 example cards)_ | Grid cards.                |
| `items[].icon`            | `"brain"` \| `"users"` \| `"plug"` \| `"globe"` \| `"code"` \| `"zap"` | `"brain"`           | Card icon.                 |
| `items[].title`           | `string`                                                               | `"Card title"`      | Card title.                |
| `items[].description`     | `string`                                                               | —                   | Card description.          |
| `items[].size`            | `"default"` \| `"wide"` \| `"tall"`                                    | `"default"`         | Card span size.            |
| `items[].rounded`         | `boolean`                                                              | `false`             | Rounded corners.           |
| `items[].background`      | `boolean`                                                              | `true`              | Decorative background.     |
| `items[].ctaLabel`        | `string`                                                               | `"Learn more >"`    | CTA label.                 |
| `items[].ctaHref`         | `string`                                                               | `"#"`               | CTA href.                  |
| `items[].ctaOpenInNewTab` | `boolean`                                                              | `false`             | Open the CTA in a new tab. |

> `children` and `className` are also accepted on the component directly: pass
> `BentoCard` children to bypass the serializable `items` array.

## Theme & Responsiveness

Supports light and dark themes via the `theme` prop and shadcn CSS variable tokens. The `platform` prop controls layout: `adaptive` automatically switches between mobile, tablet, and desktop grid layouts based on viewport width.
