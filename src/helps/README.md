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

## Examples

### Basic usage

Render the CTA with the bundled example avatars via `defaultProps`.

```tsx
import "@anvilkit/helps/styles.css";
import { Helps, defaultProps } from "@anvilkit/helps";

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

### Initials-only avatars

Each avatar falls back to `initials` (or initials derived from `name`) when no
`imageUrl` is supplied.

```tsx
import { Helps } from "@anvilkit/helps";

export function ContributorWall() {
  return (
    <Helps
      message={"We're grateful for our contributors."}
      buttonLabel="Become a contributor"
      buttonHref="https://github.com/example/repo"
      buttonOpenInNewTab
      avatars={[
        { name: "Alice Johnson", initials: "AJ" },
        { name: "Bob Brown", initials: "BB" },
        { name: "Charlie Davis" },
      ]}
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type HelpsProps } from "@anvilkit/helps";

const config: Config<{ Helps: HelpsProps }> = {
  components: {
    Helps: componentConfig,
  },
};
```

## API

Derived from the exported `HelpsProps` type and the Puck `fields` schema.

| Prop                 | Type            | Default                     | Description                              |
| -------------------- | --------------- | --------------------------- | ---------------------------------------- |
| `message`            | `string`        | _(grateful-community copy)_ | CTA message text (supports line breaks). |
| `buttonLabel`        | `string`        | `"Become a contributor"`    | Action button label.                     |
| `buttonHref`         | `string`        | `"/contribute"`             | Action button link.                      |
| `buttonOpenInNewTab` | `boolean`       | `false`                     | Open the link in a new tab.              |
| `avatars`            | `HelpsAvatar[]` | _(5 example avatars)_       | Contributor avatar stack.                |
| `avatars[].name`     | `string`        | `"New contributor"`         | Contributor name (shown in tooltip).     |
| `avatars[].imageUrl` | `string`        | `""`                        | Avatar image URL.                        |
| `avatars[].initials` | `string`        | `"NC"`                      | Fallback initials when no image is set.  |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
