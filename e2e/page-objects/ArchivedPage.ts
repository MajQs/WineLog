/**
 * Archived Page Object
 * Represents the archived batches list page
 */

import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Archived Page Class
 * Provides methods for interacting with the archived batches page
 */
export class ArchivedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the archived page
   */
  async navigate(): Promise<void> {
    await this.goto("/archived");
    await this.waitForPageLoad();
  }

  /**
   * Get a specific batch card by batch ID
   * @param batchId - The ID of the batch
   */
  getBatchCard(batchId: string): Locator {
    return this.getByTestId(`archived-batch-card-${batchId}`);
  }

  /**
   * Check if a batch card is visible
   * @param batchId - The ID of the batch
   */
  async isBatchVisible(batchId: string): Promise<boolean> {
    return await this.getBatchCard(batchId).isVisible();
  }

  /**
   * Get the rating element for a specific batch
   * @param batchId - The ID of the batch
   */
  getBatchRating(batchId: string): Locator {
    return this.getByTestId(`archived-batch-rating-${batchId}`);
  }

  /**
   * Check if a batch has a visible rating
   * @param batchId - The ID of the batch
   */
  async isBatchRatingVisible(batchId: string): Promise<boolean> {
    return await this.getBatchRating(batchId).isVisible();
  }

  /**
   * Click on a batch card to open details
   * @param batchId - The ID of the batch
   */
  async clickBatch(batchId: string): Promise<void> {
    await this.getBatchCard(batchId).click();
    await this.page.waitForURL(`/archived/${batchId}`, { timeout: 30000 });
  }

  /**
   * Get all batch cards on the page
   */
  getAllBatchCards(): Locator {
    return this.page.locator('[data-testid^="archived-batch-card-"]');
  }

  /**
   * Get the count of visible batch cards
   */
  async getBatchCount(): Promise<number> {
    return await this.getAllBatchCards().count();
  }
}


