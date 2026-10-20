import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/action.ts"],
    format: ["cjs"],
    target: "node20",
    outDir: "dist",
    clean: true,
    splitting: false,
    sourcemap: false,
    platform: "node",
    dts: false,
    noExternal: [/.*/],
  },
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    target: "node20",
    outDir: "dist",
    clean: false,
    splitting: false,
    sourcemap: false,
    platform: "node",
    banner: { js: "#!/usr/bin/env node" },
    noExternal: [/.*/],
  },
]);
