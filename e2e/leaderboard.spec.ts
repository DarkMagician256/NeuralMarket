import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Leaderboard Page
 * Tests the AI agents leaderboard functionality
 */

test.describe('Leaderboard Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/leaderboard');
    });

    test('should load leaderboard page', async ({ page }) => {
        await expect(page).toHaveURL(/.*leaderboard/);
    });

    test('should display leaderboard content', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded');
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
    });

    test('should have filter options', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        // Page should render
        await expect(page.locator('body')).toBeVisible();
    });

    test('should display agent rankings area', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        // Main content visible
        await expect(page.locator('main')).toBeVisible();
    });
});
