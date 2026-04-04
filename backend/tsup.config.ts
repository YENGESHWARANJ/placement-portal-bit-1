import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["cjs"],
  target: "node20",
  sourcemap: false,
  clean: true,
  minify: false,
  skipNodeModulesBundle: true,
  noExternal: [],
  shims: true,
});
