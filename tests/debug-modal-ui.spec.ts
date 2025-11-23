import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3004';

test('debug character creation modal flow', async ({ page }) => {
  // Navigate to app
  await page.goto(BASE_URL);

  // Wait for game to load
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(3000); // Wait for Phaser to fully initialize

  // Take screenshot of main menu
  await page.screenshot({ path: 'screenshots/01-main-menu.png', fullPage: true });
  console.log('📸 Screenshot: Main menu');

  // Click on the canvas where "New Journey" button is (center-ish, below title)
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    // Click in the middle horizontally, about 60% down (where first button should be)
    await canvas.click({ position: { x: box.width / 2, y: box.height * 0.6 } });
    console.log(`✅ Clicked on canvas at (${box.width / 2}, ${box.height * 0.6})`);
  }
  await page.waitForTimeout(3000);

  // Take screenshot after clicking New Journey
  await page.screenshot({ path: 'screenshots/02-after-new-journey.png', fullPage: true });
  console.log('📸 Screenshot: After New Journey clicked');

  // Wait for age selection or character creation to appear
  await page.waitForTimeout(2000);

  // Take screenshot of current state
  await page.screenshot({ path: 'screenshots/03-current-scene.png', fullPage: true });
  console.log('📸 Screenshot: Current scene');

  // Check for any textareas
  const textareas = await page.locator('textarea').count();
  console.log(`Found ${textareas} textarea(s)`);

  if (textareas > 0) {
    // Get textarea info
    const textarea = page.locator('textarea').first();
    const boundingBox = await textarea.boundingBox();
    const styles = await textarea.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        left: computed.left,
        top: computed.top,
        width: computed.width,
        height: computed.height,
        zIndex: computed.zIndex,
        backgroundColor: computed.backgroundColor,
        border: computed.border,
      };
    });

    console.log('📝 Textarea info:', { boundingBox, styles });

    // Take screenshot with textarea visible
    await page.screenshot({ path: 'screenshots/04-textarea-visible.png', fullPage: true });
    console.log('📸 Screenshot: Textarea visible');
  }

  // Check canvas position
  const canvasBox = await canvas.boundingBox();
  console.log('🎮 Canvas position:', canvasBox);

  // Wait to see the UI
  await page.waitForTimeout(5000);
});
