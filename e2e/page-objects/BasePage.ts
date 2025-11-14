/**
 * Base Page Object
 * Provides common functionality for all page objects
 */

import type { Page, Locator } from "@playwright/test";

/**
 * Base Page Object Class
 * Contains shared methods and utilities for page objects
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get element by test ID
   */
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wait for a specific element to be visible
   * @param locator - The locator to wait for
   * @param timeout - Optional timeout in milliseconds (default: 10000)
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for authentication to be ready
   * Useful after login to ensure the session is fully established
   */
  async waitForAuthReady(): Promise<void> {
    // Wait for network to settle
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
    
    // Wait for user email element (indicates auth state is loaded)
    const userEmail = this.page.getByTestId("user-email");
    await userEmail.waitFor({ state: "visible", timeout: 10000 }).catch(() => {
      // If user-email doesn't exist, that's okay for some pages
    });
  }

  /**
   * Get current URL
   */
  url(): string {
    return this.page.url();
  }

  /**
   * Get the Playwright Page object
   * Useful for operations not covered by page object methods
   */
  getPage(): Page {
    return this.page;
  }
}


