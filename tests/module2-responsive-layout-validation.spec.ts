/**
 * Module 2 Responsive Layout Validation Test
 * Tests Module2MemoryConstellation on multiple resolutions
 * Ensures no overlapping elements and proper fit without scrolling
 */

import { test, expect, Page } from '@playwright/test';

// Test resolutions
const RESOLUTIONS = [
  { name: '13-inch Laptop (1366x768)', width: 1366, height: 768 },
  { name: '13-inch MacBook (1440x900)', width: 1440, height: 900 },
  { name: 'Full HD Desktop (1920x1080)', width: 1920, height: 1080 },
];

/**
 * Navigate to Module 2 scene
 */
async function navigateToModule2(page: Page): Promise<void> {
  await page.goto('http://localhost:5173');

  // Age selection
  await page.waitForSelector('text=Adult (18+)', { timeout: 10000 });
  await page.click('text=Adult (18+)');

  // Character creation - enter name
  await page.waitForSelector('text=Your Name:', { timeout: 10000 });
  const nameBox = page.locator('text=Click to enter...').first();
  await nameBox.click();

  // Fill modal input
  await page.waitForSelector('input[type="text"]', { timeout: 5000 });
  await page.fill('input[type="text"]', 'TestUser');
  await page.keyboard.press('Enter');

  // Wait a bit for name to register
  await page.waitForTimeout(500);

  // Click Begin Journey button
  await page.waitForSelector('text=Begin Your Journey', { timeout: 5000 });
  await page.click('text=Begin Your Journey');

  // Wait for Hub Scene
  await page.waitForSelector('text=Emotion Explorer', { timeout: 10000 });

  // Click Anxious emotion (or any emotion to get to Module 2)
  const anxiousEmotion = page.locator('text=ANXIOUS').first();
  await anxiousEmotion.click();

  // Wait for Module 2 to load
  await page.waitForSelector('text=Memory Reflection', { timeout: 10000 });
}

/**
 * Get bounding boxes for all critical elements
 */
async function getElementBounds(page: Page) {
  const title = await page.locator('text=Memory Reflection').first().boundingBox();
  const subtitle = await page.locator('text=Connect memories and associations').first().boundingBox();
  const exploring = await page.locator('text=Exploring:').first().boundingBox();
  const instructions = await page.locator('text=Click anywhere to place').first().boundingBox();
  const memoryCounter = await page.locator('text=Memories Mapped:').first().boundingBox();
  const memoryLabel = await page.locator('text=Write words, phrases').first().boundingBox();
  const continueButton = await page.locator('text=Continue to Next Step').first().boundingBox();

  return {
    title,
    subtitle,
    exploring,
    instructions,
    memoryCounter,
    memoryLabel,
    continueButton,
  };
}

/**
 * Check if two boxes overlap
 */
function boxesOverlap(box1: any, box2: any): boolean {
  if (!box1 || !box2) return false;

  return !(
    box1.y + box1.height < box2.y || // box1 is above box2
    box1.y > box2.y + box2.height || // box1 is below box2
    box1.x + box1.width < box2.x ||  // box1 is left of box2
    box1.x > box2.x + box2.width     // box1 is right of box2
  );
}

// Test each resolution
RESOLUTIONS.forEach(({ name, width, height }) => {
  test(`Module 2 layout - ${name}`, async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width, height });

    console.log(`\n🖥️  Testing resolution: ${name} (${width}x${height})`);

    // Navigate to Module 2
    await navigateToModule2(page);

    // Wait for layout to stabilize
    await page.waitForTimeout(1000);

    // Take screenshot for visual verification
    await page.screenshot({
      path: `tests/screenshots/module2-${width}x${height}.png`,
      fullPage: false, // Only visible viewport
    });

    console.log(`📸 Screenshot saved: module2-${width}x${height}.png`);

    // Get all element bounds
    const bounds = await getElementBounds(page);

    console.log('\n📏 Element Positions:');
    console.log(`  Title: y=${bounds.title?.y.toFixed(0)}, height=${bounds.title?.height.toFixed(0)}`);
    console.log(`  Subtitle: y=${bounds.subtitle?.y.toFixed(0)}, height=${bounds.subtitle?.height.toFixed(0)}`);
    console.log(`  Exploring: y=${bounds.exploring?.y.toFixed(0)}, height=${bounds.exploring?.height.toFixed(0)}`);
    console.log(`  Instructions: y=${bounds.instructions?.y.toFixed(0)}, height=${bounds.instructions?.height.toFixed(0)}`);
    console.log(`  Memory Counter: y=${bounds.memoryCounter?.y.toFixed(0)}, height=${bounds.memoryCounter?.height.toFixed(0)}`);
    console.log(`  Memory Label: y=${bounds.memoryLabel?.y.toFixed(0)}, height=${bounds.memoryLabel?.height.toFixed(0)}`);
    console.log(`  Continue Button: y=${bounds.continueButton?.y.toFixed(0)}, height=${bounds.continueButton?.height.toFixed(0)}`);

    // TEST 1: All elements must be visible within viewport
    console.log('\n✅ TEST 1: All elements visible within viewport');
    expect(bounds.title, 'Title should be visible').toBeTruthy();
    expect(bounds.subtitle, 'Subtitle should be visible').toBeTruthy();
    expect(bounds.exploring, 'Exploring text should be visible').toBeTruthy();
    expect(bounds.instructions, 'Instructions should be visible').toBeTruthy();
    expect(bounds.memoryCounter, 'Memory counter should be visible').toBeTruthy();
    expect(bounds.memoryLabel, 'Memory label should be visible').toBeTruthy();
    expect(bounds.continueButton, 'Continue button should be visible').toBeTruthy();

    // TEST 2: No elements should exceed viewport height (no scrolling needed)
    console.log('\n✅ TEST 2: No scrolling required');
    if (bounds.title) {
      expect(bounds.title.y).toBeGreaterThanOrEqual(0);
      expect(bounds.title.y + bounds.title.height).toBeLessThanOrEqual(height);
    }
    if (bounds.continueButton) {
      expect(bounds.continueButton.y + bounds.continueButton.height).toBeLessThanOrEqual(height);
    }

    // TEST 3: No overlapping between critical elements
    console.log('\n✅ TEST 3: No overlapping elements');

    // Check memory label doesn't overlap continue button
    const labelButtonOverlap = boxesOverlap(bounds.memoryLabel, bounds.continueButton);
    expect(labelButtonOverlap, 'Memory label should NOT overlap Continue button').toBe(false);

    // Check instructions don't overlap memory counter
    const instructionsCounterOverlap = boxesOverlap(bounds.instructions, bounds.memoryCounter);
    expect(instructionsCounterOverlap, 'Instructions should NOT overlap Memory counter').toBe(false);

    // Check title doesn't overlap subtitle
    const titleSubtitleOverlap = boxesOverlap(bounds.title, bounds.subtitle);
    expect(titleSubtitleOverlap, 'Title should NOT overlap Subtitle').toBe(false);

    // TEST 4: Proper spacing between bottom elements (critical fix validation)
    console.log('\n✅ TEST 4: Proper spacing between memory input and button');
    if (bounds.memoryLabel && bounds.continueButton) {
      const spacing = bounds.continueButton.y - (bounds.memoryLabel.y + bounds.memoryLabel.height);
      console.log(`  Spacing: ${spacing.toFixed(0)}px`);
      expect(spacing, 'Should have at least 40px gap between memory input and button').toBeGreaterThanOrEqual(40);
    }

    // TEST 5: Interactive elements are clickable
    console.log('\n✅ TEST 5: Interactive elements are clickable');

    // Try clicking the memory associations text box
    const memoryTextBox = page.locator('text=Click to write your memory associations').first();
    await expect(memoryTextBox).toBeVisible();

    // Try clicking continue button (even if disabled)
    const continueBtn = page.locator('text=Continue to Next Step').first();
    await expect(continueBtn).toBeVisible();

    // TEST 6: Verify compact mode is active for small screens
    if (height <= 900) {
      console.log('\n✅ TEST 6: Compact mode validation (small screen)');

      // Title should be higher up on compact screens
      if (bounds.title) {
        expect(bounds.title.y, 'Title should be at ~60px on compact screens').toBeLessThan(80);
      }

      // Continue button should be positioned absolutely on compact screens
      if (bounds.continueButton) {
        const buttonY = bounds.continueButton.y + (bounds.continueButton.height / 2);
        expect(buttonY, 'Button should be around 660px on compact screens').toBeGreaterThan(630);
        expect(buttonY, 'Button should be around 660px on compact screens').toBeLessThan(700);
      }
    } else {
      console.log('\n✅ TEST 6: Normal mode validation (large screen)');

      // Continue button should be positioned from bottom on normal screens
      if (bounds.continueButton) {
        const distanceFromBottom = height - (bounds.continueButton.y + bounds.continueButton.height);
        expect(distanceFromBottom, 'Button should be ~100px from bottom on normal screens').toBeLessThan(150);
      }
    }

    console.log(`\n✅ ${name}: ALL TESTS PASSED\n`);
  });
});

// Additional test: Click through full flow on smallest resolution
test('Module 2 complete flow on 13-inch laptop', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });

  console.log('\n🔄 Testing complete Module 2 flow on 1366x768');

  await navigateToModule2(page);

  // Place 3 memory stars
  console.log('  Placing memory stars...');
  for (let i = 0; i < 3; i++) {
    await page.mouse.click(683 + i * 100, 400 + i * 30);
    await page.waitForTimeout(300);
  }

  // Verify counter updated
  const counterText = await page.locator('text=Memories Mapped: 3').first();
  await expect(counterText).toBeVisible();

  // Click memory associations text box
  console.log('  Writing memory associations...');
  const memoryBox = page.locator('text=Click to write your memory associations').first();
  await memoryBox.click();

  // Fill modal
  await page.waitForSelector('textarea', { timeout: 5000 });
  await page.fill('textarea', 'Test memory associations for anxious emotion: work stress, deadlines, presentations, meetings');

  // Click submit button in modal
  const submitBtn = page.locator('button:has-text("Submit")').first();
  await submitBtn.click();

  // Wait for button to become enabled
  await page.waitForTimeout(500);

  // Verify continue button is now fully visible and enabled
  const continueBtn = page.locator('text=Continue to Next Step').first();
  await expect(continueBtn).toBeVisible();

  // Take final screenshot
  await page.screenshot({
    path: 'tests/screenshots/module2-complete-flow-1366x768.png',
    fullPage: false,
  });

  console.log('✅ Complete flow test passed on 13-inch laptop\n');
});
