import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    e2e: "src/e2e/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "@mittwald/flow-remote-react-components",
    "@playwright/test",
  ],
  target: "es2018",
  clean: true,
});
