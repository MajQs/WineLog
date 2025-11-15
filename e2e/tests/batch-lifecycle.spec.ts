/**
 * E2E Test: Batch Lifecycle - Stage Progression with Notes
 * Tests the complete lifecycle of a batch from creation through stages to completion
 */

import { test, expect } from "../fixtures/auth.fixture";
import { BatchDetailPage, ArchivedPage, ArchivedBatchPage } from "../page-objects";

test.describe("Batch Lifecycle - Stage Progression", () => {
  test("should complete full batch lifecycle with notes and rating", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    // Create new batch
    const modal = await dashboardPage.clickNewBatch();
    await modal.waitForModalOpen();

    const batchName = `E2E Test Batch ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    // Wait for navigation to batch detail page
    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Stage 1: Add notes and verify
    // ═══════════════════════════════════════════════════════════════════

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());

    // Wait for batch data to be fully loaded
    await batchDetailPage.waitForBatchDataLoaded();

    // Verify we're on stage 1
    const currentStage = await batchDetailPage.getCurrentStagePosition();
    expect(currentStage).toBe(1);

    // Verify batch name is displayed
    const displayedBatchName = await batchDetailPage.getBatchName();
    expect(displayedBatchName).toContain(batchName);

    // Add a note on stage 1
    await batchDetailPage.addNote(
      "Rozpoczęto przygotowanie nastawu",
      "Wszystkie składniki są gotowe, temperatura pokojowa OK"
    );

    // Wait for note to be added
    await dashboardPage.getPage().waitForTimeout(1000);

    // Verify note was added
    const notesCount = await batchDetailPage.getNotesCount();
    expect(notesCount).toBeGreaterThanOrEqual(1);

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Stage 2: Advance with note
    // ═══════════════════════════════════════════════════════════════════

    // Advance to stage 2 with a note
    await batchDetailPage.advanceToNextStageWithNote("Zakończono przygotowanie", "Przejście do kolejnego etapu");

    // Verify we're on stage 2
    await expect(async () => {
      const stage = await batchDetailPage.getCurrentStagePosition();
      expect(stage).toBe(2);
    }).toPass({ timeout: 10000 });

    // Verify next stage button is still visible (not last stage)
    await expect(batchDetailPage.getNextStageButton()).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Stage 2: Add multiple notes
    // ═══════════════════════════════════════════════════════════════════

    // Add first note on stage 2
    await batchDetailPage.addNote("Wykonano tłoczenie", "Otrzymano 10L soku");

    await dashboardPage.getPage().waitForTimeout(1000);

    // Add second note on stage 2
    await batchDetailPage.addNote("Zmierzono gęstość", "BLG: 22, temperatura: 20°C");

    await dashboardPage.getPage().waitForTimeout(1000);

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Stage 3: Advance without note
    // ═══════════════════════════════════════════════════════════════════

    // Advance to stage 3 without adding a note in the dialog
    await batchDetailPage.advanceToNextStage();

    // Verify we're on stage 3
    await expect(async () => {
      const stage = await batchDetailPage.getCurrentStagePosition();
      expect(stage).toBe(3);
    }).toPass({ timeout: 10000 });

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Complete batch with rating
    // ═══════════════════════════════════════════════════════════════════

    // For simplicity, let's advance through remaining stages quickly
    // Check if we're on the last stage by checking if complete button is visible
    let isLastStage = await batchDetailPage.isCompleteBatchButtonVisible();

    // Keep advancing until we reach the last stage (or max 10 iterations to prevent infinite loop)
    let iterations = 0;
    const maxIterations = 10;

    while (!isLastStage && iterations < maxIterations) {
      // Check if next stage button exists
      const hasNextButton = await batchDetailPage.isNextStageButtonVisible();

      if (hasNextButton) {
        await batchDetailPage.advanceToNextStage();
        await dashboardPage.getPage().waitForTimeout(2000);
        isLastStage = await batchDetailPage.isCompleteBatchButtonVisible();
      } else {
        break;
      }

      iterations++;
    }

    // Verify complete batch button is visible
    await expect(batchDetailPage.getCompleteBatchButton()).toBeVisible({ timeout: 10000 });

    // Save the batch ID before completing (for later verification)
    const batchId = batchDetailPage.getBatchIdFromUrl();

    // Complete the batch with a 4-star rating
    await batchDetailPage.completeBatchWithRating(4);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Verify redirect to dashboard
    // ═══════════════════════════════════════════════════════════════════

    // Verify we're back on the dashboard
    await dashboardPage.getPage().waitForURL("/dashboard", { timeout: 30000 });
    expect(dashboardPage.url()).toContain("/dashboard");

    // We can verify this by checking that the dashboard loaded successfully
    await expect(dashboardPage.getNewBatchButton()).toBeVisible();

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Navigate to archived view
    // ═══════════════════════════════════════════════════════════════════

    // Click the archived link in the dashboard
    await dashboardPage.clickArchived();

    // Verify we're on the archived page
    await dashboardPage.getPage().waitForURL("/archived", { timeout: 30000 });
    expect(dashboardPage.url()).toContain("/archived");

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Verify batch is visible in archived view
    // ═══════════════════════════════════════════════════════════════════

    const archivedPage = new ArchivedPage(dashboardPage.getPage());

    // Wait for the page to load
    await archivedPage.waitForPageLoad();
    await dashboardPage.getPage().waitForTimeout(5000);

    // Verify the batch is visible
    const isBatchVisible = await archivedPage.isBatchVisible(batchId);
    expect(isBatchVisible).toBe(true);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Verify rating is visible
    // ═══════════════════════════════════════════════════════════════════

    const isRatingVisible = await archivedPage.isBatchRatingVisible(batchId);
    expect(isRatingVisible).toBe(true);

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Enter archived batch detail view
    // ═══════════════════════════════════════════════════════════════════

    await archivedPage.clickBatch(batchId);

    // Verify we're on the archived batch detail page
    await dashboardPage.getPage().waitForURL(`/archived/${batchId}`, { timeout: 30000 });
    expect(dashboardPage.url()).toContain(`/archived/${batchId}`);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Verify notes are visible
    // ═══════════════════════════════════════════════════════════════════

    const archivedBatchPage = new ArchivedBatchPage(dashboardPage.getPage());
    await archivedBatchPage.waitForBatchDataLoaded();

    // Verify batch name is displayed
    const archivedBatchName = await archivedBatchPage.getBatchName();
    expect(archivedBatchName).toContain(batchName);

    // Verify notes are visible (we added notes during the test)
    const areNotesVisible = await archivedBatchPage.areNotesVisible();
    expect(areNotesVisible).toBe(true);

    const archivedNotesCount = await archivedBatchPage.getNotesCount();
    expect(archivedNotesCount).toBeGreaterThan(0);

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Delete the batch
    // ═══════════════════════════════════════════════════════════════════

    await archivedBatchPage.deleteBatch();

    // Verify we're redirected back to the archived page
    await dashboardPage.getPage().waitForURL("/archived", { timeout: 30000 });
    expect(dashboardPage.url()).toContain("/archived");

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT - Verify batch is no longer visible in archived view
    // ═══════════════════════════════════════════════════════════════════

    // Wait for the page to reload after deletion
    await dashboardPage.getPage().waitForTimeout(1000);

    // Verify the batch is no longer visible
    const isBatchStillVisible = await archivedPage.isBatchVisible(batchId);
    expect(isBatchStillVisible).toBe(false);

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Navigate to dashboard and verify batch is gone
    // ═══════════════════════════════════════════════════════════════════

    await dashboardPage.navigate();

    // Verify we're on the dashboard
    expect(dashboardPage.url()).toContain("/dashboard");

    // Verify the dashboard loaded successfully
    await expect(dashboardPage.getNewBatchButton()).toBeVisible();
  });

  test("should add multiple notes to current stage", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    const modal = await dashboardPage.clickNewBatch();
    const batchName = `Notes Test ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());
    await batchDetailPage.waitForBatchDataLoaded();

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Add multiple notes
    // ═══════════════════════════════════════════════════════════════════

    // Add first note
    await batchDetailPage.addNote("Pierwsza notatka", "Obserwacja pierwsza");
    await dashboardPage.getPage().waitForTimeout(1000);

    // Add second note
    await batchDetailPage.addNote("Druga notatka", "Obserwacja druga");
    await dashboardPage.getPage().waitForTimeout(1000);

    // Add third note
    await batchDetailPage.addNote("Trzecia notatka");
    await dashboardPage.getPage().waitForTimeout(1000);

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Verify all notes were added
    const notesCount = await batchDetailPage.getNotesCount();
    expect(notesCount).toBeGreaterThanOrEqual(3);
  });

  test("should advance through stages without notes", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    const modal = await dashboardPage.clickNewBatch();
    const batchName = `No Notes Test ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());
    await batchDetailPage.waitForBatchDataLoaded();

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Advance through stages without notes
    // ═══════════════════════════════════════════════════════════════════

    // Stage 1 -> 2
    await batchDetailPage.advanceToNextStage();
    await expect(async () => {
      const stage = await batchDetailPage.getCurrentStagePosition();
      expect(stage).toBe(2);
    }).toPass({ timeout: 10000 });

    // Stage 2 -> 3
    await batchDetailPage.advanceToNextStage();
    await expect(async () => {
      const stage = await batchDetailPage.getCurrentStagePosition();
      expect(stage).toBe(3);
    }).toPass({ timeout: 10000 });

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Verify we successfully advanced to stage 3
    const currentStage = await batchDetailPage.getCurrentStagePosition();
    expect(currentStage).toBe(3);
  });

  test("should advance stage with note in dialog", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    const modal = await dashboardPage.clickNewBatch();
    const batchName = `Dialog Note Test ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());
    await batchDetailPage.waitForBatchDataLoaded();

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Advance with note in dialog
    // ═══════════════════════════════════════════════════════════════════

    await batchDetailPage.advanceToNextStageWithNote(
      "Notatka dodana przez dialog",
      "To jest notatka dodana podczas przechodzenia do kolejnego etapu"
    );

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Verify we advanced to stage 2
    await expect(async () => {
      const stage = await batchDetailPage.getCurrentStagePosition();
      expect(stage).toBe(2);
    }).toPass({ timeout: 10000 });

    // Note: Verifying the note content would require more complex logic
    // as the note would be in the history section for the previous stage
  });

  test("should validate note form", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    const modal = await dashboardPage.clickNewBatch();
    const batchName = `Validation Test ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());
    await batchDetailPage.waitForBatchDataLoaded();

    // ═══════════════════════════════════════════════════════════════════
    // ACT & ASSERT - Test validation
    // ═══════════════════════════════════════════════════════════════════

    // Get the submit button
    const submitButton = batchDetailPage.getPage().getByTestId("button-submit-note");

    // Submit button should be disabled when action is empty
    await expect(submitButton).toBeDisabled();

    // Fill only observations (action is required)
    const observationsInput = batchDetailPage.getPage().getByTestId("textarea-note-observations");
    await observationsInput.fill("Tylko obserwacje");

    // Button should still be disabled
    await expect(submitButton).toBeDisabled();

    // Fill action field
    const actionInput = batchDetailPage.getPage().getByTestId("textarea-note-action");
    await actionInput.fill("Akcja wymagana");

    // Button should now be enabled
    await expect(submitButton).toBeEnabled();

    // Test character limit - fill 201 characters
    const longText = "a".repeat(201);
    await actionInput.fill(longText);

    // Input should truncate to 200 characters (maxLength attribute)
    const value = await actionInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(200);
  });

  test("should complete batch without rating", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch and navigate to last stage
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    const modal = await dashboardPage.clickNewBatch();
    const batchName = `No Rating Test ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());
    await batchDetailPage.waitForBatchDataLoaded();

    // Advance to last stage
    let isLastStage = await batchDetailPage.isCompleteBatchButtonVisible();
    let iterations = 0;
    const maxIterations = 10;

    while (!isLastStage && iterations < maxIterations) {
      const hasNextButton = await batchDetailPage.isNextStageButtonVisible();

      if (hasNextButton) {
        await batchDetailPage.advanceToNextStage();
        await dashboardPage.getPage().waitForTimeout(2000);
        isLastStage = await batchDetailPage.isCompleteBatchButtonVisible();
      } else {
        break;
      }

      iterations++;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Complete without rating
    // ═══════════════════════════════════════════════════════════════════

    await batchDetailPage.completeBatch();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Verify redirect to dashboard
    await dashboardPage.getPage().waitForURL("/dashboard", { timeout: 30000 });
    expect(dashboardPage.url()).toContain("/dashboard");
  });

  test("should cancel next stage dialog", async ({ authenticatedPage }) => {
    // ═══════════════════════════════════════════════════════════════════
    // ARRANGE - Create a new batch
    // ═══════════════════════════════════════════════════════════════════
    const dashboardPage = authenticatedPage;

    const modal = await dashboardPage.clickNewBatch();
    const batchName = `Cancel Test ${Date.now()}`;
    await modal.createBatchWithFirstTemplate(batchName);

    await dashboardPage.getPage().waitForURL(/\/batches\/[a-f0-9-]{36}/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const batchDetailPage = new BatchDetailPage(dashboardPage.getPage());
    await batchDetailPage.waitForBatchDataLoaded();

    // ═══════════════════════════════════════════════════════════════════
    // ACT - Open and cancel dialog
    // ═══════════════════════════════════════════════════════════════════

    const initialStage = await batchDetailPage.getCurrentStagePosition();

    await batchDetailPage.clickNextStage();

    // Verify dialog is open
    const dialog = batchDetailPage.getPage().getByTestId("dialog-next-stage");
    await expect(dialog).toBeVisible();

    // Cancel
    await batchDetailPage.cancelNextStage();

    // ═══════════════════════════════════════════════════════════════════
    // ASSERT
    // ═══════════════════════════════════════════════════════════════════

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();

    // Verify we're still on the same stage
    const currentStage = await batchDetailPage.getCurrentStagePosition();
    expect(currentStage).toBe(initialStage);
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
      waitUntil: "domcontentloaded",
    });
    expect(dashboardPage.url()).toMatch(/\/batches\/[a-f0-9-]{36}/);
  });

  test("should validate batch creation form", async ({ authenticatedPage }) => {
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
});
