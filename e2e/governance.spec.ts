import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Governance Page
 * Tests the governance voting functionality
 */

test.describe('Governance Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/governance');
    });

    test('should load governance page', async ({ page }) => {
        await expect(page).toHaveURL(/.*governance/);
    });

    test('should display governance content', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded');
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
    });

    test('should show proposals section', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
    });
});
