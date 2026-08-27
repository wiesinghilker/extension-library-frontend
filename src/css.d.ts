// TS 6 checks side-effect imports (noUncheckedSideEffectImports); the stylesheet
// is bundled by tsup and has no type declarations of its own.
declare module "*.css";
