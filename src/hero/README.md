# @anvilkit/hero

A Puck-native marketing hero component with a striped dark backdrop, announcement pill, and dual download CTAs.

## Install

```sh
pnpm add @anvilkit/hero @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/hero/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field                      | Type     | Default                                  |
| -------------------------- | -------- | ---------------------------------------- |
| `announcementLabel`        | text     | `"We raised $69M pre seed"`              |
| `announcementHref`         | text     | `""`                                     |
| `announcementOpenInNewTab` | radio    | `false`                                  |
| `headline`                 | textarea | `"Write fast with\naccurate precision."` |
| `description`              | textarea | `"Our state of the art tool..."`         |
| `linuxLabel`               | text     | `"Download for Linux"`                   |
| `linuxHref`                | text     | `"/download/linux"`                      |
| `linuxOpenInNewTab`        | radio    | `false`                                  |
| `windowsLabel`             | text     | `"Download for Windows"`                 |
| `windowsHref`              | text     | `"/download/windows"`                    |
| `windowsOpenInNewTab`      | radio    | `false`                                  |

## Usage

```tsx
import "@anvilkit/hero/styles.css";
import type { Config } from "@puckeditor/core";
import {
  Hero,
  componentConfig,
  defaultProps,
  type HeroProps,
} from "@anvilkit/hero";

// Puck config registration
const config: Config<{ Hero: HeroProps }> = {
  components: {
    Hero: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return (
    <Hero
      announcementLabel="Launching today"
      headline={"Build faster.\nShip sooner."}
      description="A modern toolkit for teams that move fast."
      linuxLabel="Download for Linux"
      linuxHref="/download/linux"
      windowsLabel="Download for Windows"
      windowsHref="/download/windows"
    />
  );
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
