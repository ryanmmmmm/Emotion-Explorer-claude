import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3004';

test('visual verification - wait for manual navigation', async ({ page }) => {
  // Monitor for errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('❌ Console Error:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.message);
    console.error('❌ Page Error:', err.message);
  });

  // Navigate to app
  await page.goto(BASE_URL);
  await page.waitForSelector('canvas', { timeout: 10000 });
  console.log('✅ Page loaded - Navigate manually through the UI');
  console.log('   1. Click "New Journey"');
  console.log('   2. Select age bracket');
  console.log('   3. Observe character creation scene');
  console.log('');
  console.log('Waiting 30 seconds for manual navigation...');

  // Take screenshots at intervals
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshots/visual-01-after-5sec.png', fullPage: true });
  console.log('📸 Screenshot: After 5 seconds');

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshots/visual-02-after-10sec.png', fullPage: true });
  console.log('📸 Screenshot: After 10 seconds');

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshots/visual-03-after-15sec.png', fullPage: true });
  console.log('📸 Screenshot: After 15 seconds');

  // Check final state
  const finalTextareas = await page.locator('textarea').count();
  console.log(`\n📊 Final textarea count: ${finalTextareas}`);
  console.log(`📊 Console errors: ${errors.length}`);

  // Verify no unexpected textareas (unless modal is open)
  if (finalTextareas > 1) {
    console.error('❌ More than 1 textarea found (unexpected)');
  }

  expect(errors.length, 'No console errors should occur').toBe(0);
});
