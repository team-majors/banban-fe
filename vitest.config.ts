import path from "path";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsx: "automatic", // ✅ React 17+ automatic runtime
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/utils/test/setupTests.ts",
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
