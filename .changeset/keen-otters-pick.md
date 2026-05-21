---
"@anvilkit/design-block": minor
---

Add `artboardId` field with dynamic `resolveFields`: the inspector renders a select when a host has registered an artboard catalog via `setArtboardCatalog`, otherwise a text input. Exposes the `artboard-catalog` bridge (`setArtboardCatalog` / `getArtboardCatalog` / `listArtboards`) and `ArtboardCatalogEntry` / `ArtboardCatalogFn` types so canvas-side integrations can wire their live IR pages into the Puck inspector.
