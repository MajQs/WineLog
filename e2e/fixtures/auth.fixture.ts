/**
 * Authentication Fixture
 * Provides authenticated context for tests
 */

import { test as base } from "@playwright/test";
import { DashboardPage } from "../page-objects/DashboardPage";

/**
 * Extended test with authentication
 * Uses storage state from global setup - no need to login for each test!
 */
export const test = base.extend<{
  authenticatedPage: DashboardPage;
}>({
  authenticatedPage: async ({ page }, use) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Authentication state already loaded from global setup
    // ═══════════════════════════════════════════════════════════════════

    // No login needed! Storage state from global-setup.ts is automatically loaded
    // Just navigate to dashboard and wait for it to be ready

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Navigate to dashboard
    // ═══════════════════════════════════════════════════════════════════

    await page.goto("/dashboard");

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT (implicit) - Verify dashboard is ready
    // ═══════════════════════════════════════════════════════════════════

    // Wait for user email to be visible (confirms auth state is working)
    await page.getByTestId("user-email").waitFor({
      state: "visible",
      timeout: 10000,
    });

    const dashboardPage = new DashboardPage(page);

    await use(dashboardPage);

    // Cleanup (optional)
    // Note: We don't clear cookies/storage as it would affect other tests
  },
});

export { expect } from "@playwright/test";
