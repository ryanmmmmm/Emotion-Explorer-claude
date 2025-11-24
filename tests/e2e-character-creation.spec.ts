import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3004';

test('full character creation flow with console monitoring', async ({ page }) => {
  // Collect console errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('❌ Console Error:', msg.text());
    } else if (msg.type() === 'log') {
      console.log('📝 Console Log:', msg.text());
    }
  });

  // Collect page errors
  page.on('pageerror', (err) => {
    errors.push(err.message);
    console.error('❌ Page Error:', err.message);
  });

  // Navigate
  await page.goto(BASE_URL);
  await page.waitForSelector('canvas', { timeout: 10000 });

  console.log('✅ Page loaded');
  await page.waitForTimeout(2000);

  // Take screenshot of initial state
  await page.screenshot({ path: 'screenshots/e2e-01-main-menu.png', fullPage: true });

  // Check for unexpected textareas
  const initialTextareas = await page.locator('textarea').count();
  console.log(`📊 Initial textarea count: ${initialTextareas}`);

  if (initialTextareas > 0) {
    console.error('❌ CRITICAL: Textarea found on initial page load!');
    const textarea = page.locator('textarea').first();
    const value = await textarea.inputValue();
    console.error(`   Textarea value: "${value}"`);

    const styles = await textarea.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        visibility: computed.visibility,
        position: computed.position,
        left: computed.left,
        top: computed.top,
        zIndex: computed.zIndex,
      };
    });
    console.error('   Textarea styles:', JSON.stringify(styles, null, 2));
  }

  // Check for console errors
  if (errors.length > 0) {
    console.error('❌ Errors detected:', errors);
  }

  console.log('\n🎯 Test Summary:');
  console.log(`   Textareas on load: ${initialTextareas} (should be 0)`);
  console.log(`   Console errors: ${errors.length}`);

  // Fail test if critical issues found
  expect(initialTextareas, 'No textareas should be visible on initial load').toBe(0);
  expect(errors.length, 'No console errors should occur').toBe(0);
});
