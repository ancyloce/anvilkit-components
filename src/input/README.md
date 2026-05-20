# @anvilkit/input

A Puck-native form input block with label, helper text, and validation support.

## Install

```sh
pnpm add @anvilkit/input @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/input/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field          | Type     | Options                                             | Default                                          |
| -------------- | -------- | --------------------------------------------------- | ------------------------------------------------ |
| `label`        | text     | —                                                   | `"Email address"`                                |
| `name`         | text     | —                                                   | `"email"`                                        |
| `type`         | select   | `text`, `email`, `password`, `search`, `tel`, `url` | `"email"`                                        |
| `placeholder`  | text     | —                                                   | `"Enter your email"`                             |
| `helperText`   | textarea | —                                                   | `"We will only use this for important updates."` |
| `defaultValue` | text     | —                                                   | `""`                                             |
| `required`     | radio    | `false`, `true`                                     | `false`                                          |
| `disabled`     | radio    | `false`, `true`                                     | `false`                                          |

## Usage

```tsx
import "@anvilkit/input/styles.css";
import type { Config } from "@puckeditor/core";
import {
  Input,
  componentConfig,
  defaultProps,
  type InputProps,
} from "@anvilkit/input";

// Puck config registration
const config: Config<{ Input: InputProps }> = {
  components: {
    Input: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return (
    <Input label="Email address" name="email" placeholder="Enter your email" />
  );
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
