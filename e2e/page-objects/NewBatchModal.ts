/**
 * New Batch Modal Page Object
 * Represents the modal dialog for creating a new batch
 */

import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * New Batch Modal Class
 * Provides methods for interacting with the new batch creation modal
 */
export class NewBatchModal extends BasePage {
  // Main container locators
  private readonly dialog: Locator;
  private readonly templatePickerGrid: Locator;
  private readonly batchNameInput: Locator;
  private readonly cancelButton: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dialog = this.getByTestId("dialog-new-batch");
    this.templatePickerGrid = this.getByTestId("template-picker-grid");
    this.batchNameInput = this.getByTestId("input-batch-name");
    this.cancelButton = this.getByTestId("button-cancel-batch");
    this.submitButton = this.getByTestId("button-submit-batch");
  }

  /**
   * Wait for the modal to be visible
   */
  async waitForModalOpen(): Promise<void> {
    await this.dialog.waitFor({ state: "visible" });
  }

  /**
   * Wait for the modal to be hidden
   */
  async waitForModalClose(): Promise<void> {
    await this.dialog.waitFor({ state: "hidden" });
  }

  /**
   * Check if the modal is visible
   */
  async isModalVisible(): Promise<boolean> {
    return await this.dialog.isVisible();
  }

  /**
   * Select a template by its ID
   * @param templateId - The ID of the template to select
   */
  async selectTemplate(templateId: string): Promise<void> {
    const templateCard = this.getByTestId(`template-card-${templateId}`);
    await templateCard.click();
  }

  /**
   * Select the first available template
   */
  async selectFirstTemplate(): Promise<void> {
    const firstTemplate = this.templatePickerGrid.locator("[data-testid^='template-card-']").first();
    await firstTemplate.click();
  }

  /**
   * Check if a template is selected
   * @param templateId - The ID of the template to check
   */
  async isTemplateSelected(templateId: string): Promise<boolean> {
    const templateCard = this.getByTestId(`template-card-${templateId}`);
    const ariaPressed = await templateCard.getAttribute("aria-pressed");
    return ariaPressed === "true";
  }

  /**
   * Get all available template cards
   */
  getTemplateCards(): Locator {
    return this.templatePickerGrid.locator("[data-testid^='template-card-']");
  }

  /**
   * Get count of available templates
   */
  async getTemplateCount(): Promise<number> {
    return await this.getTemplateCards().count();
  }

  /**
   * Fill in the batch name
   * @param name - The name to enter
   */
  async fillBatchName(name: string): Promise<void> {
    await this.batchNameInput.fill(name);
  }

  /**
   * Clear the batch name
   */
  async clearBatchName(): Promise<void> {
    await this.batchNameInput.clear();
  }

  /**
   * Get the current value of the batch name input
   */
  async getBatchName(): Promise<string> {
    return await this.batchNameInput.inputValue();
  }

  /**
   * Click the cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Click the submit button to create the batch
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Check if the submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  /**
   * Check if the submit button is disabled
   */
  async isSubmitButtonDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Check if the cancel button is enabled
   */
  async isCancelButtonEnabled(): Promise<boolean> {
    return await this.cancelButton.isEnabled();
  }

  /**
   * Complete the batch creation form
   * @param templateId - The ID of the template to select
   * @param batchName - Optional name for the batch
   */
  async createBatch(templateId: string, batchName?: string): Promise<void> {
    // Arrange
    await this.selectTemplate(templateId);
    
    if (batchName) {
      await this.fillBatchName(batchName);
    }

    // Act
    await this.clickSubmit();

    // Wait for modal to close or navigation to occur
    await this.waitForModalClose().catch(() => {
      // Modal might close immediately on successful creation
    });
  }

  /**
   * Complete the batch creation with the first available template
   * @param batchName - Optional name for the batch
   */
  async createBatchWithFirstTemplate(batchName?: string): Promise<void> {
    // Arrange
    await this.selectFirstTemplate();
    
    if (batchName) {
      await this.fillBatchName(batchName);
    }

    // Act
    await this.clickSubmit();

    // Wait for modal to close or navigation to occur
    await this.waitForModalClose().catch(() => {
      // Modal might close immediately on successful creation
    });
  }

  /**
   * Get the dialog locator (for assertions)
   */
  getDialog(): Locator {
    return this.dialog;
  }

  /**
   * Get the batch name input locator (for assertions)
   */
  getBatchNameInput(): Locator {
    return this.batchNameInput;
  }

  /**
   * Get the submit button locator (for assertions)
   */
  getSubmitButton(): Locator {
    return this.submitButton;
  }

  /**
   * Get the cancel button locator (for assertions)
   */
  getCancelButton(): Locator {
    return this.cancelButton;
  }
}


