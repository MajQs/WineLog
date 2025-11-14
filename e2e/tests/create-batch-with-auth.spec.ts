/**
 * E2E Test: Create Batch Flow with Authentication
 * Tests the complete user journey for creating a new batch with authentication
 */

import { test, expect } from "../fixtures/auth.fixture";

test.describe("Create Batch Flow (Authenticated)", () => {
  test("should complete full batch creation journey", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - User is already logged in via fixture
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    // Verify we're on the dashboard
    await expect(dashboardPage.getNewBatchButton()).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // ACT - User Journey
    // ═══════════════════════════════════════════════════════════════════

    // Step 1: Click add batch button
    const modal = await dashboardPage.clickNewBatch();

    // Step 2: Wait for modal to open
    await modal.waitForModalOpen();
    await expect(modal.getDialog()).toBeVisible();

    // Step 3: Fill in new batch data
    await modal.selectFirstTemplate();
    
    const batchName = `Test Batch ${new Date().getFullYear()}`;
    await modal.fillBatchName(batchName);

    // Verify form is ready to submit
    await expect(modal.getSubmitButton()).toBeEnabled();

    // Step 4: Save the batch
    await modal.clickSubmit();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Verify Success
    // ═══════════════════════════════════════════════════════════════════

    // Should redirect to the new batch detail page
    // Increased timeout for cold starts and API response time
    await authenticatedPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded"
    });
    expect(authenticatedPage.url()).toMatch(/\/batches\/[a-f0-9-]{36}/);
    
    // Verify batch name is displayed on the detail page
    const batchHeading = authenticatedPage.getPage().getByRole('heading', { 
      name: batchName, 
      level: 1 
    });
    await expect(batchHeading).toBeVisible({ timeout: 10000 });
    
  });

  test("should create batch with minimal data (template only)", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Already authenticated
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════

    const modal = await dashboardPage.clickNewBatch();
    await modal.waitForModalOpen();

    // Only select template, don't fill name
    await modal.selectFirstTemplate();

    // Submit
    await modal.clickSubmit();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Should still create batch successfully
    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded"
    });
    expect(dashboardPage.url()).toMatch(/\/batches\/[a-f0-9-]{36}/);
  });

  test("should validate form before submission", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Already authenticated
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════

    const modal = await dashboardPage.clickNewBatch();
    await modal.waitForModalOpen();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Validation
    // ═══════════════════════════════════════════════════════════════════

    // Submit button should be disabled when no template is selected
    await expect(modal.getSubmitButton()).toBeDisabled();

    // Select template
    await modal.selectFirstTemplate();

    // Submit button should be enabled after template selection
    await expect(modal.getSubmitButton()).toBeEnabled();
  });

  test("should allow canceling batch creation", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Already authenticated
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    // ═══════════════════════════════════════════════════════════════════
    // ACT
    // ═══════════════════════════════════════════════════════════════════

    const modal = await dashboardPage.clickNewBatch();
    await modal.waitForModalOpen();

    // Fill some data
    await modal.selectFirstTemplate();
    await modal.fillBatchName("Test Batch");

    // Cancel instead of submitting
    await modal.clickCancel();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Should return to dashboard
    await dashboardPage.getPage().waitForURL("/dashboard");
    expect(dashboardPage.url()).toContain("/dashboard");

    // Modal should be closed
    await expect(modal.getDialog()).not.toBeVisible();
  });

  test("should use high-level method for quick batch creation", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Already authenticated
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;
    const batchName = `Quick Batch ${Date.now()}`;

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Using composite method
    // ═══════════════════════════════════════════════════════════════════

    const modal = await dashboardPage.clickNewBatch();
    
    // One method call to complete entire form
    await modal.createBatchWithFirstTemplate(batchName);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Should successfully create batch
    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded"
    });
    expect(dashboardPage.url()).toMatch(/\/batches\/[a-f0-9-]{36}/);
  });
});


