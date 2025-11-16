/**
 * E2E Test: Authentication - Login Flow
 * Tests user login functionality
 *
 * NOTE: These tests run in 'chromium-no-auth' project without saved storage state
 * This ensures we're actually testing the login flow, not using cached authentication
 */

import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";

test.describe("Login Flow", () => {
  test("should login successfully with valid credentials", async ({ page }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE
    // ═══════════════════════════════════════════════════════════════════
    const loginPage = new LoginPage(page);
    const email = process.env.E2E_USERNAME || "test@winelog.local";
    const password = process.env.E2E_PASSWORD || "TestPassword123!";

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════
    await loginPage.navigate();
    await loginPage.login(email, password);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Should redirect to dashboard
    // Use domcontentloaded to avoid waiting for all resources
    await page.waitForURL(/\/dashboard/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });
    expect(page.url()).toContain("/dashboard");

    // Should display user email in the header (top-right corner)
    const userEmailElement = page.getByTestId("user-email");
    await expect(userEmailElement).toBeVisible({ timeout: 10000 });
    await expect(userEmailElement).toHaveText(email);
  });

  test("should show login form elements", async ({ page }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE
    // ═══════════════════════════════════════════════════════════════════
    const loginPage = new LoginPage(page);

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════
    await loginPage.navigate();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // All form elements should be visible
    await expect(loginPage.getEmailInput()).toBeVisible();
    await expect(loginPage.getPasswordInput()).toBeVisible();
    await expect(loginPage.getSubmitButton()).toBeVisible();
  });

  test("should handle invalid credentials gracefully", async ({ page }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE
    // ═══════════════════════════════════════════════════════════════════
    const loginPage = new LoginPage(page);

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════
    await loginPage.navigate();
    await loginPage.fillEmail("invaliduser@email.com");
    await loginPage.fillPassword("wrongpassword");
    await loginPage.clickSubmit();

    // Wait a bit for potential error message
    await page.waitForTimeout(3000);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Should stay on login page
    expect(page.url()).toContain("/login");

    // Should show error message (if implemented)
    await expect(loginPage.hasError()).toBeTruthy();
  });
});
