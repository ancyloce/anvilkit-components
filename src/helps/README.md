# @anvilkit/helps

A Puck-native contributor CTA block with avatar stack, message, and action button.

## Install

```sh
pnpm add @anvilkit/helps @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/helps/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field                | Type     | Description              | Default                                                     |
| -------------------- | -------- | ------------------------ | ----------------------------------------------------------- |
| `message`            | textarea | CTA message text         | `"We're grateful for the amazing open-source community..."` |
| `buttonLabel`        | text     | Action button label      | `"Become a contributor"`                                    |
| `buttonHref`         | text     | Action button link       | `"/contribute"`                                             |
| `buttonOpenInNewTab` | radio    | Open link in new tab     | `false`                                                     |
| `avatars`            | array    | Contributor avatar stack | _(5 example avatars)_                                       |
| `avatars[].name`     | text     | Contributor name         | —                                                           |
| `avatars[].imageUrl` | text     | Avatar image URL         | —                                                           |
| `avatars[].initials` | text     | Fallback initials        | —                                                           |

## Usage

```tsx
import "@anvilkit/helps/styles.css";
import type { Config } from "@puckeditor/core";
import {
  Helps,
  componentConfig,
  defaultProps,
  type HelpsProps,
} from "@anvilkit/helps";

// Puck config registration
const config: Config<{ Helps: HelpsProps }> = {
  components: {
    Helps: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return (
    <Helps
      message="Join our open-source community today."
      buttonLabel="Get started"
      buttonHref="/contribute"
      avatars={defaultProps.avatars}
    />
  );
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
