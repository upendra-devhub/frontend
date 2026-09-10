import { test, expect } from '@playwright/test';

test.describe('Full-Screen Interactive Report Deck', () => {
  test('navigates through all 6 report deck slides via buttons, tabs, and arrow keys', async ({ page }) => {
    // 1. Load homepage
    await page.goto('/');
    await expect(page.locator('#section-hero')).toBeVisible();

    // Verify report deck is not visible before trend selection
    await expect(page.locator('#trend-report')).not.toBeVisible();

    // 2. Click first hot trend (Cricket World Cup)
    const firstTrend = page.locator('.hot-trend-row').first();
    await expect(firstTrend).toBeVisible();
    await firstTrend.click();

    // 3. Verify report deck opens on Slide 1: Overview
    const deck = page.locator('#trend-report');
    await expect(deck).toBeVisible();
    await expect(page.locator('#deck-tab-overview')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Cricket World Cup' })).toBeVisible();

    // Wait for scroll into view and animation to settle
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/slide-1-overview.png' });

    // 4. Click Next button in header to advance to Slide 2: Momentum
    const nextBtn = page.locator('#deck-next-btn');
    await nextBtn.click();
    await expect(page.locator('#deck-tab-momentum')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Trend Momentum' })).toBeVisible();

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/slide-2-momentum.png' });

    // 5. Use ArrowRight keyboard shortcut to advance to Slide 3: Audience
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#deck-tab-audience')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Age Distribution', exact: true })).toBeVisible();

    await page.waitForTimeout(1100);
    await page.screenshot({ path: 'test-results/slide-3-audience.png' });

    // 6. Click Slide 4: Sentiment tab
    const sentimentTab = page.locator('#deck-tab-sentiment');
    await sentimentTab.click();
    await expect(sentimentTab).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Sentiment Insights' })).toBeVisible();

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/slide-4-sentiment.png' });

    // 7. Click Slide 5: Influence tab
    const influenceTab = page.locator('#deck-tab-influence');
    await influenceTab.click();
    await expect(influenceTab).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Influence Network' })).toBeVisible();

    await page.waitForTimeout(800);
    await page.screenshot({ path: 'test-results/slide-5-influence.png' });

    // 8. Use ArrowRight keyboard shortcut to advance to Slide 6: Regional
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#deck-tab-regional')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Regional Intelligence' })).toBeVisible();

    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/slide-6-regional.png' });

    // 9. Use ArrowLeft keyboard shortcut to test backward step
    await page.keyboard.press('ArrowLeft');
    await expect(influenceTab).toHaveAttribute('aria-current', 'page');

    // 10. Click "Change Trend" button to return to Hero
    const changeTrendBtn = page.locator('#deck-change-trend-btn');
    await changeTrendBtn.click();
    await page.waitForTimeout(600);
    await expect(page.locator('#section-hero')).toBeInViewport();
  });

  test('always resets to Slide 1 (Overview) when changing trends or re-selecting', async ({ page }) => {
    await page.goto('/');

    // 1. Select Trend 1 (first row: Cricket World Cup)
    const trendRows = page.locator('.hot-trend-row');
    await trendRows.nth(0).click();

    // Verify on Slide 1
    await expect(page.locator('#deck-tab-overview')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'Cricket World Cup' })).toBeVisible();

    // 2. Navigate to Slide 4 (Sentiment)
    await page.locator('#deck-tab-sentiment').click();
    await expect(page.locator('#deck-tab-sentiment')).toHaveAttribute('aria-current', 'page');

    // 3. Scroll back to Hero and pick a DIFFERENT trend (second row)
    await page.locator('#deck-change-trend-btn').click();
    await page.waitForTimeout(500);

    await trendRows.nth(1).click();
    await page.waitForTimeout(500);

    // Verify deck reset to Slide 1: Overview
    await expect(page.locator('#deck-tab-overview')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#deck-slide-counter')).toContainText('01');

    // 4. Advance second trend to Slide 3 (Audience)
    await page.locator('#deck-tab-audience').click();
    await expect(page.locator('#deck-tab-audience')).toHaveAttribute('aria-current', 'page');

    // 5. Select Trend 1 again (previously visited trend!)
    await page.locator('#deck-change-trend-btn').click();
    await page.waitForTimeout(500);

    await trendRows.nth(0).click();
    await page.waitForTimeout(500);

    // Verify deck MUST start from Slide 1 (Overview), NOT Slide 4 or Slide 3
    await expect(page.locator('#deck-tab-overview')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#deck-slide-counter')).toContainText('01');
    await expect(page.getByRole('heading', { name: 'Cricket World Cup' })).toBeVisible();

    // 6. Advance Trend 1 to Slide 2 (Momentum)
    await page.locator('#deck-tab-momentum').click();
    await expect(page.locator('#deck-tab-momentum')).toHaveAttribute('aria-current', 'page');

    // Re-click the EXACT SAME trend
    await page.locator('#deck-change-trend-btn').click();
    await page.waitForTimeout(500);
    await trendRows.nth(0).click();
    await page.waitForTimeout(500);

    // Verify it resets back to Slide 1 (Overview) even if same trend clicked again
    await expect(page.locator('#deck-tab-overview')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('#deck-slide-counter')).toContainText('01');
  });
});
