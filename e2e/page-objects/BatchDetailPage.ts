/**
 * Batch Detail Page Object
 * Represents the batch detail page with stages, notes, and actions
 */

import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Batch Detail Page Class
 * Provides methods for interacting with the batch detail page
 */
export class BatchDetailPage extends BasePage {
  // Locators
  private readonly nextStageButton: Locator;
  private readonly completeBatchButton: Locator;

  // Note form locators
  private readonly noteForm: Locator;
  private readonly noteActionInput: Locator;
  private readonly noteObservationsInput: Locator;
  private readonly submitNoteButton: Locator;

  // Next stage dialog locators
  private readonly nextStageDialog: Locator;
  private readonly advanceActionInput: Locator;
  private readonly advanceObservationsInput: Locator;
  private readonly confirmNextStageButton: Locator;
  private readonly cancelNextStageButton: Locator;

  // Complete batch dialog locators
  private readonly completeBatchDialog: Locator;
  private readonly confirmCompleteButton: Locator;
  private readonly cancelCompleteButton: Locator;

  constructor(page: Page) {
    super(page);

    // Action buttons
    this.nextStageButton = this.getByTestId("button-next-stage");
    this.completeBatchButton = this.getByTestId("button-complete-batch");

    // Note form
    this.noteForm = this.getByTestId("form-note");
    this.noteActionInput = this.getByTestId("textarea-note-action");
    this.noteObservationsInput = this.getByTestId("textarea-note-observations");
    this.submitNoteButton = this.getByTestId("button-submit-note");

    // Next stage dialog
    this.nextStageDialog = this.getByTestId("dialog-next-stage");
    this.advanceActionInput = this.getByTestId("textarea-advance-action");
    this.advanceObservationsInput = this.getByTestId("textarea-advance-observations");
    this.confirmNextStageButton = this.getByTestId("button-confirm-next-stage");
    this.cancelNextStageButton = this.getByTestId("button-cancel-next-stage");

    // Complete batch dialog
    this.completeBatchDialog = this.getByTestId("dialog-complete-batch");
    this.confirmCompleteButton = this.getByTestId("button-confirm-complete");
    this.cancelCompleteButton = this.getByTestId("button-cancel-complete");
  }

  /**
   * Navigate to a specific batch detail page
   * @param batchId - The ID of the batch
   */
  async navigate(batchId: string): Promise<void> {
    await this.goto(`/batches/${batchId}`);
    await this.waitForPageLoad();
    await this.waitForBatchDataLoaded();
  }

  /**
   * Wait for batch data to be fully loaded
   * Waits for the batch name (h1) to be visible, indicating data is loaded
   */
  async waitForBatchDataLoaded(): Promise<void> {
    // Wait for the batch name heading to be visible
    const heading = this.page.getByRole("heading", { level: 1 }).first();
    await heading.waitFor({ state: "visible", timeout: 15000 });

    // Wait for network to be idle to ensure all data is loaded
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    // Additional wait for stage timeline to render
    await this.page.waitForTimeout(500);
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE INFORMATION
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Get the current stage heading (e.g., "Etap 1")
   */
  async getCurrentStageHeading(): Promise<string | null> {
    const currentStageLabel = this.page.locator('text="Aktualny"').first();
    const isVisible = await currentStageLabel.isVisible().catch(() => false);

    if (!isVisible) return null;

    // Get the stage position from the preceding sibling span element
    const stagePositionElement = currentStageLabel.locator("xpath=preceding-sibling::span[1]");
    return await stagePositionElement.textContent();
  }

  /**
   * Get the current stage position number
   */
  async getCurrentStagePosition(): Promise<number | null> {
    const heading = await this.getCurrentStageHeading();
    if (!heading) return null;

    const match = heading.match(/Etap (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Check if a specific stage position is marked as current
   * @param position - The stage position to check
   */
  async isStageCurrentByPosition(position: number): Promise<boolean> {
    const currentPosition = await this.getCurrentStagePosition();
    return currentPosition === position;
  }

  // ═══════════════════════════════════════════════════════════════════
  // NOTES
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Add a note to the current stage
   * @param action - The action text (required)
   * @param observations - Optional observations
   */
  async addNote(action: string, observations?: string): Promise<void> {
    await this.noteActionInput.fill(action);

    if (observations) {
      await this.noteObservationsInput.fill(observations);
    }

    await this.submitNoteButton.click();

    // Wait for the note to be added (toast notification or form reset)
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if the note form is visible
   */
  async isNoteFormVisible(): Promise<boolean> {
    return await this.noteForm.isVisible();
  }

  /**
   * Get all note cards on the page
   */
  getNoteCards(): Locator {
    return this.page.locator('[role="listitem"]');
  }

  /**
   * Get the count of notes displayed
   */
  async getNotesCount(): Promise<number> {
    return await this.getNoteCards().count();
  }

  /**
   * Get note content by index (0-based)
   * @param index - The index of the note
   */
  async getNoteContent(index: number): Promise<{ action: string; observations?: string }> {
    const noteCard = this.getNoteCards().nth(index);
    const action = (await noteCard.locator("p").first().textContent()) || "";

    // Try to get observations if they exist
    const observationElements = await noteCard.locator("p").count();
    const observations =
      observationElements > 1 ? (await noteCard.locator("p").nth(1).textContent()) || undefined : undefined;

    return { action, observations };
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE ADVANCEMENT
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Click the "Next Stage" button to open the dialog
   */
  async clickNextStage(): Promise<void> {
    await this.nextStageButton.click();
    await this.nextStageDialog.waitFor({ state: "visible" });
  }

  /**
   * Advance to the next stage without adding a note
   */
  async advanceToNextStage(): Promise<void> {
    await this.clickNextStage();
    await this.confirmNextStageButton.click();

    // Wait for the dialog to close and navigation/update to complete
    await this.nextStageDialog.waitFor({ state: "hidden" }).catch(() => undefined);
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });
  }

  /**
   * Advance to the next stage with a note
   * @param action - The action text
   * @param observations - Optional observations
   */
  async advanceToNextStageWithNote(action: string, observations?: string): Promise<void> {
    await this.clickNextStage();

    // Fill in the note fields in the dialog
    await this.advanceActionInput.fill(action);

    if (observations) {
      await this.advanceObservationsInput.fill(observations);
    }

    await this.confirmNextStageButton.click();

    // Wait for the dialog to close and navigation/update to complete
    await this.nextStageDialog.waitFor({ state: "hidden" }).catch(() => undefined);
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });
  }

  /**
   * Cancel the next stage dialog
   */
  async cancelNextStage(): Promise<void> {
    await this.cancelNextStageButton.click();
    await this.nextStageDialog.waitFor({ state: "hidden" });
  }

  /**
   * Check if the next stage button is visible
   */
  async isNextStageButtonVisible(): Promise<boolean> {
    return await this.nextStageButton.isVisible();
  }

  /**
   * Check if the next stage button is enabled
   */
  async isNextStageButtonEnabled(): Promise<boolean> {
    return await this.nextStageButton.isEnabled();
  }

  /**
   * Get the next stage button locator (for assertions)
   */
  getNextStageButton(): Locator {
    return this.nextStageButton;
  }

  // ═══════════════════════════════════════════════════════════════════
  // BATCH COMPLETION
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Click the "Complete Batch" button to open the dialog
   */
  async clickCompleteBatch(): Promise<void> {
    await this.completeBatchButton.click();
    await this.completeBatchDialog.waitFor({ state: "visible" });
  }

  /**
   * Complete the batch without rating
   */
  async completeBatch(): Promise<void> {
    await this.clickCompleteBatch();
    await this.confirmCompleteButton.click();

    // Wait for redirect to dashboard (might take a moment)
    await this.page.waitForURL("/dashboard", { timeout: 30000 });
  }

  /**
   * Complete the batch with a rating
   * @param rating - Rating from 1 to 5
   */
  async completeBatchWithRating(rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    await this.clickCompleteBatch();

    // Click the rating button
    const ratingButton = this.getByTestId(`button-rating-${rating}`);
    await ratingButton.click();

    await this.confirmCompleteButton.click();

    // Wait for redirect to dashboard (might take a moment)
    await this.page.waitForURL("/dashboard", { timeout: 30000 });
  }

  /**
   * Cancel the complete batch dialog
   */
  async cancelCompleteBatch(): Promise<void> {
    await this.cancelCompleteButton.click();
    await this.completeBatchDialog.waitFor({ state: "hidden" });
  }

  /**
   * Check if the complete batch button is visible
   */
  async isCompleteBatchButtonVisible(): Promise<boolean> {
    return await this.completeBatchButton.isVisible();
  }

  /**
   * Check if the complete batch button is enabled
   */
  async isCompleteBatchButtonEnabled(): Promise<boolean> {
    return await this.completeBatchButton.isEnabled();
  }

  /**
   * Get the complete batch button locator (for assertions)
   */
  getCompleteBatchButton(): Locator {
    return this.completeBatchButton;
  }

  // ═══════════════════════════════════════════════════════════════════
  // BATCH INFORMATION
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Get the batch name from the page heading
   */
  async getBatchName(): Promise<string> {
    const heading = this.page.getByRole("heading", { level: 1 }).first();
    return (await heading.textContent()) || "";
  }

  /**
   * Extract batch ID from current URL
   */
  getBatchIdFromUrl(): string {
    const url = this.url();
    const match = url.match(/\/batches\/([a-f0-9-]{36})/);
    return match ? match[1] : "";
  }
}
