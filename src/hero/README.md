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

## Examples

### Basic usage

Render the hero with custom copy. `headline` and `description` honor line breaks
(`\n`).

```tsx
import "@anvilkit/hero/styles.css";
import { Hero } from "@anvilkit/hero";

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

### Linked announcement pill

Set `announcementHref` to turn the pill into a link; `announcementOpenInNewTab`
opens it in a new tab. Each download CTA has the same `href` / `openInNewTab`
pairing.

```tsx
import { Hero } from "@anvilkit/hero";

export function LaunchHero() {
  return (
    <Hero
      announcementLabel="We raised $69M pre seed"
      announcementHref="/blog/seed-round"
      announcementOpenInNewTab
      headline="Write fast with accurate precision."
      description="Our state of the art tool writes copy instantly."
      linuxLabel="Get the Linux build"
      linuxHref="/download/linux"
      windowsLabel="Get the Windows build"
      windowsHref="/download/windows"
      windowsOpenInNewTab
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type HeroProps } from "@anvilkit/hero";

const config: Config<{ Hero: HeroProps }> = {
  components: {
    Hero: componentConfig,
  },
};
```

## API

Derived from the exported `HeroProps` type and the Puck `fields` schema.

| Prop                       | Type      | Default                                  | Description                              |
| -------------------------- | --------- | ---------------------------------------- | ---------------------------------------- |
| `announcementLabel`        | `string`  | `"We raised $69M pre seed"`              | Announcement pill text.                  |
| `announcementHref`         | `string`  | `""`                                     | Announcement link URL.                   |
| `announcementOpenInNewTab` | `boolean` | `false`                                  | Open the announcement link in a new tab. |
| `headline`                 | `string`  | `"Write fast with\naccurate precision."` | Hero headline (supports line breaks).    |
| `description`              | `string`  | `"Our state of the art tool..."`         | Hero description (supports line breaks). |
| `linuxLabel`               | `string`  | `"Download for Linux"`                   | Linux CTA label.                         |
| `linuxHref`                | `string`  | `"/download/linux"`                      | Linux CTA link.                          |
| `linuxOpenInNewTab`        | `boolean` | `false`                                  | Open the Linux CTA in a new tab.         |
| `windowsLabel`             | `string`  | `"Download for Windows"`                 | Windows CTA label.                       |
| `windowsHref`              | `string`  | `"/download/windows"`                    | Windows CTA link.                        |
| `windowsOpenInNewTab`      | `boolean` | `false`                                  | Open the Windows CTA in a new tab.       |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
