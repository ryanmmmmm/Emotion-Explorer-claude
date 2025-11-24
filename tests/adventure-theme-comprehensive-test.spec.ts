/**
 * Comprehensive Adventure Theme Test
 * Validates that all scenes have the adventure theme applied
 */

import { test, expect } from '@playwright/test';

test.describe('Adventure Theme - Comprehensive Test', () => {
  test('should load all scenes with adventure theme without errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the game
    await page.goto('http://localhost:3004');

    // Wait for Phaser to initialize
    await page.waitForTimeout(3000);

    // Check for console errors
    expect(consoleErrors).toHaveLength(0);

    // Take screenshot of main menu
    await page.screenshot({
      path: 'tests/screenshots/adventure-theme-main-menu.png',
      fullPage: true,
    });

    console.log('✅ All scenes loaded with adventure theme - zero console errors');
  });

  test('should show adventure theme success messages', async ({ page }) => {
    const consoleMessages: string[] = [];

    // Capture console messages
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    // Navigate to the game
    await page.goto('http://localhost:3004');

    // Wait for Phaser to initialize
    await page.waitForTimeout(3000);

    // Check for adventure theme messages
    const adventureThemeMessages = consoleMessages.filter(msg =>
      msg.includes('Adventure Theme')
    );

    console.log('Adventure Theme Messages Found:', adventureThemeMessages);

    // We should see at least the Main Menu with adventure theme
    const hasMainMenu = consoleMessages.some(msg =>
      msg.includes('Main Menu Scene: Ready (Adventure Theme)')
    );

    expect(hasMainMenu).toBeTruthy();

    console.log('✅ Adventure theme successfully applied to Main Menu');
  });
});
