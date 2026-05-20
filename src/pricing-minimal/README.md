# @anvilkit/pricing-minimal

A Puck-native pricing section with headline, description, and configurable plan cards.

## Install

```sh
pnpm add @anvilkit/pricing-minimal @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/pricing-minimal/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field                           | Type     | Description                        | Default                              |
| ------------------------------- | -------- | ---------------------------------- | ------------------------------------ |
| `headline`                      | text     | Section headline                   | `"Simple, Transparent Pricing"`      |
| `description`                   | textarea | Section description                | `"Choose a plan that works best..."` |
| `plans`                         | array    | Pricing plan cards                 | _(3 example plans)_                  |
| `plans[].name`                  | text     | Plan name                          | —                                    |
| `plans[].description`           | textarea | Plan description                   | —                                    |
| `plans[].price`                 | text     | Display price                      | —                                    |
| `plans[].billingPeriodLabel`    | text     | Billing period text                | —                                    |
| `plans[].ctaLabel`              | text     | CTA button label                   | —                                    |
| `plans[].ctaHref`               | text     | CTA button link                    | —                                    |
| `plans[].ctaOpenInNewTab`       | radio    | Open link in new tab               | —                                    |
| `plans[].featured`              | radio    | Highlight as featured plan         | —                                    |
| `plans[].badgeLabel`            | text     | Badge text (e.g. `"Most Popular"`) | —                                    |
| `plans[].features`              | array    | Feature list items                 | —                                    |
| `plans[].features[].label`      | text     | Feature label                      | —                                    |
| `plans[].extraFeatures`         | array    | Additional feature items           | —                                    |
| `plans[].extraFeatures[].label` | text     | Extra feature label                | —                                    |

## Usage

```tsx
import "@anvilkit/pricing-minimal/styles.css";
import type { Config } from "@puckeditor/core";
import {
  PricingMinimal,
  componentConfig,
  defaultProps,
  type PricingMinimalProps,
} from "@anvilkit/pricing-minimal";

// Puck config registration
const config: Config<{ PricingMinimal: PricingMinimalProps }> = {
  components: {
    PricingMinimal: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return <PricingMinimal {...defaultProps} />;
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints. Plan cards stack vertically on mobile and display side-by-side on wider viewports.
