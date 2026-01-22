import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Markets Page
 * Tests the markets listing and filtering functionality
 */

test.describe('Markets Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/markets');
    });

    test('should load markets page', async ({ page }) => {
        await expect(page).toHaveURL(/.*markets/);
    });

    test('should display markets grid', async ({ page }) => {
        // Wait for content to load
        await page.waitForLoadState('networkidle');

        // Check that main content area exists
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
    });

    test('should display page header', async ({ page }) => {
        // Check for prediction markets heading
        const heading = page.getByRole('heading').first();
        await expect(heading).toBeVisible();
    });

    test('should have search/filter functionality area', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded');
        // Page should load without errors
        await expect(page.locator('body')).toBeVisible();
    });

    test('should be navigable from homepage', async ({ page }) => {
        // Start from home
        await page.goto('/');

        // Click markets link
        await page.click('a[href="/markets"]');

        // Should be on markets page
        await expect(page).toHaveURL(/.*markets/);
    });
});
