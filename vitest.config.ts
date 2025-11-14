import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Enable globals like describe, test, expect without imports
    globals: true,

    // Use happy-dom for DOM testing (React components) - faster and more stable than jsdom
    environment: "happy-dom",

    // Setup files to run before each test file
    setupFiles: ["./src/test/setup.ts"],

    // Include patterns for test files
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    // Exclude patterns
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      "**/e2e/**",
    ],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "dist/",
        ".astro/",
      ],
      // Coverage thresholds
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },

    // Mock config
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,

    // Test timeout
    testTimeout: 15000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});


