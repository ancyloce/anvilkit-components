# @anvilkit/columns

A Puck-native repeatable multi-column layout with an independent slot in each
column.

```tsx
import { Columns, componentConfig } from "@anvilkit/columns";

export function Example() {
  return (
    <Columns
      columns={[
        { label: "One", content: <p>First</p> },
        { label: "Two", content: <p>Second</p> },
      ]}
    />
  );
}

export const puckComponent = componentConfig;
```

Authors can manage two to four columns and choose the collapse breakpoint,
gap, and alignment. The repeated column elements share a stable `column`
authoring target.
