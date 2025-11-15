/**
 * Global Setup for Playwright Tests
 * Performs authentication once before all tests and saves the state
 * This allows tests to reuse the authenticated session without logging in repeatedly
 */

import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalSetup(config: FullConfig) {
  console.log('\n🔐 [Global Setup] Starting authentication...');
  
  // Get credentials from environment
  const email = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'E2E credentials not found. Please set E2E_USERNAME and E2E_PASSWORD in .env.test'
    );
  }

  // Create .auth directory if it doesn't exist
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const storageStatePath = path.join(authDir, 'user.json');

  // Get base URL from config or environment
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  // Launch browser and perform login
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    console.log('📝 [Global Setup] Logging in as:', email);
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 [Browser Error]:', msg.text());
      }
    });
  
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    
    console.log('📄 [Global Setup] Login page loaded');
    
    // Wait for React to hydrate (client:load)
    await page.waitForLoadState('networkidle');
    console.log('📡 [Global Setup] Network idle - React should be hydrated');
    
    // Fill credentials
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    
    console.log('🔑 [Global Setup] Credentials filled, submitting...');
    
    // Click submit and wait for navigation
    await page.locator('button[type="submit"]').click();
    
    // Wait a bit to see what happens
    await page.waitForTimeout(3000);
    
    // Check for error messages on the page
    const errorAlert = await page.locator('[role="alert"]').count();
    if (errorAlert > 0) {
      const errorText = await page.locator('[role="alert"]').first().textContent();
      console.log('⚠️ [Global Setup] Error message on page:', errorText);
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'e2e/.auth/login-debug.png' });
    console.log('📸 [Global Setup] Screenshot saved to e2e/.auth/login-debug.png');
    console.log('🔗 [Global Setup] Current URL:', page.url());
    
    // Wait for successful login and redirect to dashboard
    console.log('⏳ [Global Setup] Waiting for redirect to dashboard...');
    await page.waitForURL(/\/dashboard/, { 
      timeout: 30000,
      waitUntil: "domcontentloaded"
    });
    
    console.log('🎯 [Global Setup] Redirected to dashboard');
    
    // Wait for user email to be visible (confirms auth is complete)
    await page.getByTestId("user-email").waitFor({ 
      state: "visible", 
      timeout: 10000 
    });
    
    console.log('✅ [Global Setup] Login successful!');
    
    // Save authentication state to file
    await context.storageState({ path: storageStatePath });
    console.log('💾 [Global Setup] Storage state saved to:', storageStatePath);
    
  } catch (error) {
    console.error('❌ [Global Setup] Authentication failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✨ [Global Setup] Setup complete!\n');
}

export default globalSetup;

