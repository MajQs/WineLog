/**
 * Archived Batch Page Object
 * Represents the archived batch detail page (read-only view)
 */

import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Archived Batch Page Class
 * Provides methods for interacting with the archived batch detail page
 */
export class ArchivedBatchPage extends BasePage {
  // Locators
  private readonly deleteButton: Locator;
  private readonly deleteDialog: Locator;
  private readonly confirmDeleteButton: Locator;
  private readonly cancelDeleteButton: Locator;

  constructor(page: Page) {
    super(page);

    // Delete batch elements
    this.deleteButton = this.getByTestId("button-delete-batch");
    this.deleteDialog = this.getByTestId("dialog-delete-batch");
    this.confirmDeleteButton = this.getByTestId("button-confirm-delete");
    this.cancelDeleteButton = this.getByTestId("button-cancel-delete");
  }

  /**
   * Navigate to a specific archived batch detail page
   * @param batchId - The ID of the batch
   */
  async navigate(batchId: string): Promise<void> {
    await this.goto(`/archived/${batchId}`);
    await this.waitForPageLoad();
  }

  /**
   * Wait for batch data to be fully loaded
   */
  async waitForBatchDataLoaded(): Promise<void> {
    // Wait for the batch name heading to be visible
    const heading = this.page.getByRole('heading', { level: 1 }).first();
    await heading.waitFor({ state: "visible", timeout: 15000 });

    // Wait for network to be idle
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    // Additional wait for content to render
    await this.page.waitForTimeout(500);
  }

  /**
   * Get the batch name from the page heading
   */
  async getBatchName(): Promise<string> {
    const heading = this.page.getByRole('heading', { level: 1 }).first();
    return await heading.textContent() || "";
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
   * Check if notes are visible
   */
  async areNotesVisible(): Promise<boolean> {
    const count = await this.getNotesCount();
    return count > 0;
  }

  /**
   * Get the delete button locator (for assertions)
   */
  getDeleteButton(): Locator {
    return this.deleteButton;
  }

  /**
   * Check if the delete button is visible
   */
  async isDeleteButtonVisible(): Promise<boolean> {
    return await this.deleteButton.isVisible();
  }

  /**
   * Click the delete button to open the confirmation dialog
   */
  async clickDelete(): Promise<void> {
    await this.deleteButton.click();
    await this.deleteDialog.waitFor({ state: "visible" });
  }

  /**
   * Delete the batch (with confirmation)
   */
  async deleteBatch(): Promise<void> {
    await this.clickDelete();
    await this.confirmDeleteButton.click();

    // Wait for redirect to archived page
    await this.page.waitForURL("/archived", { timeout: 30000 });
  }

  /**
   * Cancel the delete dialog
   */
  async cancelDelete(): Promise<void> {
    await this.cancelDeleteButton.click();
    await this.deleteDialog.waitFor({ state: "hidden" });
  }

  /**
   * Check if the delete dialog is visible
   */
  async isDeleteDialogVisible(): Promise<boolean> {
    return await this.deleteDialog.isVisible();
  }

  /**
   * Get the delete dialog locator (for assertions)
   */
  getDeleteDialog(): Locator {
    return this.deleteDialog;
  }

  /**
   * Extract batch ID from current URL
   */
  getBatchIdFromUrl(): string {
    const url = this.url();
    const match = url.match(/\/archived\/([a-f0-9-]{36})/);
    return match ? match[1] : "";
  }
}

