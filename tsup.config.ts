import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    e2e: "src/e2e/index.ts",
  },
  format: ["cjs", "esm"],
  // Liefert die Ambient-Deklaration für das unveröffentlichte
  // @mittwald/flow-core an alle Consumer mit aus (siehe src/flow-core.d.ts).
  dts: { banner: '/// <reference path="./flow-core.d.ts" />' },
  // Für den Watch-Modus (pnpm dev); der einmalige Build kopiert zusätzlich im
  // build-Script, da onSuccess vor dem DTS-Emit laufen kann.
  onSuccess: "cp src/flow-core.d.ts dist/flow-core.d.ts",
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
