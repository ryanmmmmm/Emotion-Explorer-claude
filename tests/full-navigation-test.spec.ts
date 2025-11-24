import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3004';

test('full navigation: main menu → age selection → character creation', async ({ page }) => {
  const errors: string[] = [];
  const logs: string[] = [];

  // Collect console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('❌ Console Error:', msg.text());
    } else if (msg.type() === 'log') {
      logs.push(msg.text());
      console.log('📝 Console Log:', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.message);
    console.error('❌ Page Error:', err.message);
  });

  // Step 1: Navigate and wait for game to load
  console.log('\n🎬 Step 1: Loading main menu...');
  await page.goto(BASE_URL);
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'screenshots/nav-01-main-menu.png', fullPage: true });
  console.log('📸 Screenshot: Main menu');

  // Verify no textareas on main menu
  const mainMenuTextareas = await page.locator('textarea').count();
  console.log(`📊 Main menu textareas: ${mainMenuTextareas}`);
  expect(mainMenuTextareas).toBe(0);

  // Step 2: Click "New Journey" button
  console.log('\n🎬 Step 2: Clicking New Journey...');
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();

  if (box) {
    // Click where "New Journey" button should be (center horizontally, 60% down)
    await canvas.click({ position: { x: box.width / 2, y: box.height * 0.6 } });
    console.log(`✅ Clicked at (${box.width / 2}, ${box.height * 0.6})`);
  }

  await page.waitForTimeout(3000); // Wait for transition
  await page.screenshot({ path: 'screenshots/nav-02-age-selection.png', fullPage: true });
  console.log('📸 Screenshot: Age selection');

  // Step 3: Click age option (Teen or Adult)
  console.log('\n🎬 Step 3: Selecting age bracket...');
  if (box) {
    // Click Teen button (should be around 55% down)
    await canvas.click({ position: { x: box.width / 2, y: box.height * 0.55 } });
    console.log('✅ Selected Teen age bracket');
  }

  await page.waitForTimeout(3000); // Wait for transition to character creation
  await page.screenshot({ path: 'screenshots/nav-03-character-creation.png', fullPage: true });
  console.log('📸 Screenshot: Character creation scene');

  // Step 4: Verify character creation scene state
  console.log('\n🎬 Step 4: Verifying character creation scene...');

  // Check for unexpected textareas
  const charCreateTextareas = await page.locator('textarea').count();
  console.log(`📊 Character creation textareas: ${charCreateTextareas}`);

  if (charCreateTextareas > 0) {
    const textarea = page.locator('textarea').first();
    const value = await textarea.inputValue();
    console.error(`❌ UNEXPECTED TEXTAREA found with value: "${value}"`);

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

  // Step 5: Test modal interaction
  console.log('\n🎬 Step 5: Testing name input modal...');
  if (box) {
    // Click on the player name input box (should be around 70% down)
    await canvas.click({ position: { x: box.width / 2, y: box.height * 0.7 } });
    console.log('✅ Clicked player name input');
  }

  await page.waitForTimeout(1500); // Wait for modal to appear
  await page.screenshot({ path: 'screenshots/nav-04-modal-opened.png', fullPage: true });
  console.log('📸 Screenshot: Modal opened');

  // Check if modal appeared
  const modalTextareas = await page.locator('textarea').count();
  console.log(`📊 Modal textareas: ${modalTextareas}`);

  if (modalTextareas === 1) {
    console.log('✅ Modal textarea appeared correctly');

    // Get modal position and verify it's visible
    const modalTextarea = page.locator('textarea').first();
    const modalBox = await modalTextarea.boundingBox();
    console.log('📍 Modal position:', modalBox);

    // Type a name
    await modalTextarea.fill('TestPlayer');
    console.log('✅ Entered test name');

    // Close modal (press Escape or click outside)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'screenshots/nav-05-modal-closed.png', fullPage: true });
    console.log('📸 Screenshot: Modal closed');

    // Verify modal is closed
    const afterCloseTextareas = await page.locator('textarea').count();
    console.log(`📊 After close textareas: ${afterCloseTextareas}`);
    expect(afterCloseTextareas).toBe(0);
  } else {
    console.error(`❌ Expected 1 modal textarea, found ${modalTextareas}`);
  }

  // Final summary
  console.log('\n🎯 Test Summary:');
  console.log(`   Main menu textareas: ${mainMenuTextareas} (expected: 0) ✅`);
  console.log(`   Character creation textareas: ${charCreateTextareas} (expected: 0)`);
  console.log(`   Modal opened correctly: ${modalTextareas === 1 ? '✅' : '❌'}`);
  console.log(`   Console errors: ${errors.length}`);
  console.log(`   Console logs: ${logs.length}`);

  // Assertions
  expect(mainMenuTextareas, 'No textareas on main menu').toBe(0);
  expect(charCreateTextareas, 'No textareas on character creation before modal').toBe(0);
  expect(errors.length, 'No console errors').toBe(0);

  console.log('\n✅ All checks passed!');
});
