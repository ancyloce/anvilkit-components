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

## Examples

### Basic usage

Render the button standalone with its default primary variant.

```tsx
import "@anvilkit/button/styles.css";
import { Button } from "@anvilkit/button";

export function Example() {
  return <Button label="Save changes" variant="primary" />;
}
```

### Link button opening a new tab

Provide `href` to render an anchor; pair it with `openInNewTab` to add
`target="_blank"` plus safe `rel` attributes. A `disabled` button is
non-interactive and announces `aria-disabled`.

```tsx
import { Button } from "@anvilkit/button";

export function Actions() {
  return (
    <div className="flex gap-3">
      <Button
        label="Read the docs"
        variant="secondary"
        href="https://anvilkit.dev"
        openInNewTab
      />
      <Button label="Coming soon" variant="primary" disabled />
    </div>
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config` so authors can drop the
button onto a page.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type ButtonProps } from "@anvilkit/button";

const config: Config<{ Button: ButtonProps }> = {
  components: {
    Button: componentConfig,
  },
};
```

## API

Derived from the exported `ButtonProps` type and the Puck `fields` schema.

| Prop           | Type                         | Default          | Description                                                  |
| -------------- | ---------------------------- | ---------------- | ----------------------------------------------------------- |
| `label`        | `string`                     | `"Save changes"` | Button label text.                                          |
| `variant`      | `"primary"` \| `"secondary"` | `"primary"`      | Visual variant.                                             |
| `href`         | `string`                     | `""`             | Link URL; renders an anchor when set.                       |
| `openInNewTab` | `boolean`                    | `false`          | Open the link in a new tab.                                 |
| `disabled`     | `boolean`                    | `false`          | Disable interaction.                                        |
| `trackClick`   | `boolean`                    | `false`          | Fire an analytics event on click (requires an analytics provider). |
| `eventName`    | `string`                     | —                | Event name; defaults to `button_click`.                     |
| `eventProps`   | `{ category?: string; placement?: string }` | — | Extra properties merged into the click event.               |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
