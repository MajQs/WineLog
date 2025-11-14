/**
 * Playwright Configuration
 * E2E testing configuration for WineLog
 */

import { defineConfig, devices } from "@playwright/test";
import * as path from "path";
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Global setup - performs authentication once before all tests */
  globalSetup: path.resolve(process.cwd(), "./e2e/global-setup.ts"),

  testDir: "./e2e",
  
  /* Maximum time one test can run */
  timeout: 120 * 1000, // 120 seconds per test
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: "html",
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    
    /* Load authenticated storage state (from global setup) */
    storageState: "./e2e/.auth/user.json",
    
    /* Collect trace when retrying the failed test */
    trace: "on-first-retry",
    
    /* Screenshot on failure */
    screenshot: "only-on-failure",
    
    /* Video on failure */
    video: "retain-on-failure",
    
    /* Navigation timeout - increased for cold starts */
    navigationTimeout: 45000,
    
    /* Action timeout - time to wait for actions like click, fill */
    actionTimeout: 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Separate project for auth tests that need clean state (no storage)
    {
      name: "chromium-no-auth",
      use: { 
        ...devices["Desktop Chrome"],
        storageState: undefined, // Override to not use saved auth state
      },
      testMatch: /auth-login\.spec\.ts/, // Only run auth-login tests in this project
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000, // Increased to 3 minutes for cold starts
  },
});

