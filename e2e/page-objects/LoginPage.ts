/**
 * Login Page Object
 * Represents the login page with authentication functionality
 */

import type { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login Page Class
 * Provides methods for user authentication
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.locator('input[type="email"]');
    this.passwordInput = this.page.locator('input[type="password"]');
    this.submitButton = this.page.locator('button[type="submit"]');
    this.errorMessage = this.page.locator('[role="alert"]');
  }

  /**
   * Navigate to the login page
   */
  async navigate(): Promise<void> {
    await this.goto("/login");
    await this.waitForPageLoad();
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Perform login with credentials
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    // Wait for React to hydrate (client:load) before interacting
    await this.page.waitForLoadState("networkidle");

    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();

    // Wait for navigation after successful login
    // Use domcontentloaded to avoid waiting for all resources
    // Increase timeout for cold starts (first run)
    await this.page.waitForURL(/\/dashboard/, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    // Wait for the dashboard to be ready by checking for key UI element
    await this.page.getByTestId("user-email").waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  /**
   * Check if error message is visible
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }

  /**
   * Get email input locator (for assertions)
   */
  getEmailInput(): Locator {
    return this.emailInput;
  }

  /**
   * Get password input locator (for assertions)
   */
  getPasswordInput(): Locator {
    return this.passwordInput;
  }

  /**
   * Get submit button locator (for assertions)
   */
  getSubmitButton(): Locator {
    return this.submitButton;
  }
}
