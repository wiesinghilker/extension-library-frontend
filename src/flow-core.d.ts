/**
 * Workaround: @mittwald/ext-bridge ab 0.2.0-alpha.789 referenziert in seinen
 * publizierten Typdefinitionen (dist/types/config/types.d.ts) das Paket
 * "@mittwald/flow-core", das nicht auf npm veröffentlicht ist (nur
 * Workspace-Paket im Flow-Monorepo). Ohne diese Deklaration degradiert
 * ExtBridgeConfig zu einem Error-Type (ESLint no-unsafe-*).
 *
 * Definition 1:1 gespiegelt aus mittwald/flow packages/core/src/remote/types.ts.
 * Entfernen, sobald @mittwald/flow-core publiziert wird oder ext-bridge den
 * Import inlined.
 */
declare module "@mittwald/flow-core" {
  export interface HostConfig {
    language: string;
    theme: "dark" | "light";
  }
}
