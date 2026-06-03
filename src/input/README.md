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

## Examples

### Basic usage

Render a labelled email input with placeholder text.

```tsx
import "@anvilkit/input/styles.css";
import { Input } from "@anvilkit/input";

export function Example() {
  return (
    <Input label="Email address" name="email" placeholder="Enter your email" />
  );
}
```

### Required field with helper text

Switch the input `type`, mark it `required` (appends `*` to the label and sets
the native `required` attribute), and surface guidance with `helperText`.

```tsx
import { Input } from "@anvilkit/input";

export function PasswordField() {
  return (
    <Input
      label="Password"
      name="password"
      type="password"
      placeholder="At least 8 characters"
      helperText="Use a mix of letters, numbers, and symbols."
      required
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config` so authors can add the
field to a form.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type InputProps } from "@anvilkit/input";

const config: Config<{ Input: InputProps }> = {
  components: {
    Input: componentConfig,
  },
};
```

## API

Derived from the exported `InputProps` type and the Puck `fields` schema.

| Prop           | Type                                                                      | Default                                          | Description                            |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| `label`        | `string`                                                                  | `"Email address"`                                | Field label.                           |
| `name`         | `string`                                                                  | `"email"`                                        | Form field name.                       |
| `type`         | `"text"` \| `"email"` \| `"password"` \| `"search"` \| `"tel"` \| `"url"` | `"email"`                                        | Input type.                            |
| `placeholder`  | `string`                                                                  | `"Enter your email"`                             | Placeholder text.                      |
| `helperText`   | `string`                                                                  | `"We will only use this for important updates."` | Helper text shown below the field.     |
| `defaultValue` | `string`                                                                  | `""`                                             | Initial uncontrolled value.            |
| `required`     | `boolean`                                                                 | `false`                                          | Mark the field required (appends `*`). |
| `disabled`     | `boolean`                                                                 | `false`                                          | Disable the field.                     |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
