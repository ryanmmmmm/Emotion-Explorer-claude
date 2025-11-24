/**
 * Main Menu Adventure Theme Test
 * Validates the new adventure theme styling on the main menu
 */

import { test, expect } from '@playwright/test';

test.describe('Main Menu Adventure Theme', () => {
  test('should load main menu with adventure theme without errors', async ({ page }) => {
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

    // Take screenshot of adventure-themed main menu
    await page.screenshot({
      path: 'tests/screenshots/main-menu-adventure-theme.png',
      fullPage: true,
    });

    console.log('✅ Main Menu Adventure Theme test completed');
  });

  test('should show all adventure theme elements', async ({ page }) => {
    const consoleMessages: string[] = [];

    // Capture console messages
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });

    // Navigate to the game
    await page.goto('http://localhost:3004');

    // Wait for Phaser to initialize
    await page.waitForTimeout(3000);

    // Check for success messages
    const bootMessage = consoleMessages.some(msg => msg.includes('Main Menu Scene: Ready (Adventure Theme)'));
    expect(bootMessage).toBeTruthy();

    console.log('Console messages:', consoleMessages);
    console.log('✅ Adventure theme elements validation completed');
  });
});
