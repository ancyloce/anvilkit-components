import { nodePreset } from "@anvilkit/vitest-config/node";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	nodePreset,
	defineConfig({
		test: {
			name: "anvilkit-components",
			include: ["tests/**/*.{test,spec}.ts"],
		},
		resolve: {
			// Component packages each symlink their own react copy; dedupe so
			// config imports across packages share one instance (see
			// @anvilkit/vitest-config/react-library notes on this workspace).
			dedupe: ["react", "react-dom", "react/jsx-runtime"],
		},
	}),
);
