/**
 * Dashboard Page Object
 * Represents the main dashboard page with active batches
 */

import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { NewBatchModal } from "./NewBatchModal";

/**
 * Dashboard Page Class
 * Provides methods for interacting with the dashboard page
 */
export class DashboardPage extends BasePage {
  // Locators
  private readonly newBatchButton: Locator;
  private readonly archivedLink: Locator;

  constructor(page: Page) {
    super(page);
    this.newBatchButton = this.getByTestId("button-new-batch");
    this.archivedLink = this.getByTestId("link-archived");
  }

  /**
   * Navigate to the dashboard page
   */
  async navigate(): Promise<void> {
    await this.goto("/dashboard");
    await this.waitForPageLoad();
  }

  /**
   * Click the "New Batch" button to open the modal
   * @returns NewBatchModal instance for chaining
   */
  async clickNewBatch(): Promise<NewBatchModal> {
    await this.newBatchButton.click();
    const modal = new NewBatchModal(this.page);
    await modal.waitForModalOpen();
    return modal;
  }

  /**
   * Check if the new batch button is visible
   */
  async isNewBatchButtonVisible(): Promise<boolean> {
    return await this.newBatchButton.isVisible();
  }

  /**
   * Check if the new batch button is enabled
   */
  async isNewBatchButtonEnabled(): Promise<boolean> {
    return await this.newBatchButton.isEnabled();
  }

  /**
   * Get the new batch button locator (for assertions)
   */
  getNewBatchButton(): Locator {
    return this.newBatchButton;
  }

  /**
   * Click the archived link to navigate to archived page
   */
  async clickArchived(): Promise<void> {
    await this.archivedLink.click();
    await this.page.waitForURL("/archived", { timeout: 30000 });
  }

  /**
   * Get the archived link locator (for assertions)
   */
  getArchivedLink(): Locator {
    return this.archivedLink;
  }

  /**
   * Check if the archived link is visible
   */
  async isArchivedLinkVisible(): Promise<boolean> {
    return await this.archivedLink.isVisible();
  }
}
