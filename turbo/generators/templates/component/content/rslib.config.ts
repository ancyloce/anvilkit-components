import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: ["./src/**"],
    },
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: "esm",
    },
    {
      bundle: false,
      format: "cjs",
    },
  ],
  output: {
    target: "web",
  },
  performance: {
    // rslib defaults performance.buildCache to true, but rspack 2.x persistent
    // storage is not concurrency-safe across the parallel package builds that
    // `pnpm -r --filter "./src/*" build` spawns -> SIGABRT (exit 134). Keep off.
    buildCache: false,
  },
  plugins: [pluginReact()],
});
