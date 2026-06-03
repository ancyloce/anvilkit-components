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

## Examples

### Basic usage

Render the section with the bundled three-plan example via `defaultProps`.

```tsx
import "@anvilkit/pricing-minimal/styles.css";
import { PricingMinimal, defaultProps } from "@anvilkit/pricing-minimal";

export function Example() {
  return <PricingMinimal {...defaultProps} />;
}
```

### Custom plans with a featured card

Each plan accepts a `features` list and an optional `extraFeatures` list shown
below a divider. Set `featured` plus a `badgeLabel` to highlight a plan.

```tsx
import { PricingMinimal } from "@anvilkit/pricing-minimal";

export function TwoTier() {
  return (
    <PricingMinimal
      headline="Pricing"
      description="Start free, upgrade when you grow."
      plans={[
        {
          name: "Starter",
          description: "For individuals",
          price: "$0",
          billingPeriodLabel: "forever",
          ctaLabel: "Get started",
          ctaHref: "/signup/starter",
          features: [{ label: "1 project" }, { label: "Community support" }],
        },
        {
          name: "Team",
          description: "For growing teams",
          price: "$29",
          billingPeriodLabel: "per month",
          ctaLabel: "Start trial",
          ctaHref: "/signup/team",
          featured: true,
          badgeLabel: "Popular",
          features: [
            { label: "Unlimited projects" },
            { label: "Priority support" },
          ],
          extraFeatures: [{ label: "SSO & SAML" }],
        },
      ]}
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import {
  componentConfig,
  type PricingMinimalProps,
} from "@anvilkit/pricing-minimal";

const config: Config<{ PricingMinimal: PricingMinimalProps }> = {
  components: {
    PricingMinimal: componentConfig,
  },
};
```

## API

Derived from the exported `PricingMinimalProps` type and the Puck `fields` schema.

| Prop                            | Type               | Default                              | Description                            |
| ------------------------------- | ------------------ | ------------------------------------ | -------------------------------------- |
| `headline`                      | `string`           | `"Simple, Transparent Pricing"`      | Section headline.                      |
| `description`                   | `string`           | `"Choose a plan that works best..."` | Section description.                   |
| `plans`                         | `PricingPlan[]`    | _(3 example plans)_                  | Pricing plan cards.                    |
| `plans[].name`                  | `string`           | `"New plan"`                         | Plan name.                             |
| `plans[].description`           | `string`           | —                                    | Plan description.                      |
| `plans[].price`                 | `string`           | `"$0"`                               | Display price.                         |
| `plans[].billingPeriodLabel`    | `string`           | `"per month"`                        | Billing period text.                   |
| `plans[].ctaLabel`              | `string`           | `"Get Started"`                      | CTA button label.                      |
| `plans[].ctaHref`               | `string`           | `""`                                 | CTA button link.                       |
| `plans[].ctaOpenInNewTab`       | `boolean`          | `false`                              | Open the CTA in a new tab.             |
| `plans[].featured`              | `boolean`          | `false`                              | Highlight as the featured plan.        |
| `plans[].badgeLabel`            | `string`           | `""`                                 | Badge text shown on a featured plan.   |
| `plans[].features`              | `PricingFeature[]` | —                                    | Feature list items.                    |
| `plans[].features[].label`      | `string`           | `"Feature"`                          | Feature label.                         |
| `plans[].extraFeatures`         | `PricingFeature[]` | `[]`                                 | Additional features below the divider. |
| `plans[].extraFeatures[].label` | `string`           | `"Extra feature"`                    | Extra feature label.                   |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints. Plan cards stack vertically on mobile and display side-by-side on wider viewports.
