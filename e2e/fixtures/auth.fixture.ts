/**
 * Authentication Fixture
 * Provides authenticated context for tests
 */

import { test as base } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { DashboardPage } from "../page-objects/DashboardPage";

/**
 * Extended test with authentication
 */
export const test = base.extend<{
  authenticatedPage: DashboardPage;
}>({
  authenticatedPage: async ({ page }, use) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE
    // ═══════════════════════════════════════════════════════════════════
    
    // Get credentials from environment variables
    const email = process.env.E2E_USERNAME;
    const password = process.env.E2E_PASSWORD;

    if (!email || !password) {
      throw new Error(
        "Test credentials not found. Make sure E2E_USERNAME and E2E_PASSWORD are set in .env.test"
      );
    }

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════
    
    // Perform login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(email, password);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT (implicit)
    // ═══════════════════════════════════════════════════════════════════
    
    // login() already handles:
    // - Waiting for URL change to /dashboard/ (with domcontentloaded)
    // - Waiting for user-email element to be visible
    // This ensures the dashboard is ready to use
    
    const dashboardPage = new DashboardPage(page);

    await use(dashboardPage);

    // Cleanup (optional)
    // await page.context().clearCookies();
  },
});

export { expect } from "@playwright/test";


