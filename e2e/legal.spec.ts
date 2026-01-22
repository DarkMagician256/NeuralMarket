import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Legal Pages
 * Tests Terms of Service, Privacy Policy, and Risk Disclosure pages
 */

test.describe('Legal Pages', () => {
    test('should load Terms of Service page', async ({ page }) => {
        await page.goto('/legal/terms');
        await expect(page).toHaveURL(/.*legal\/terms/);
        await expect(page.locator('main')).toBeVisible();
    });

    test('should load Privacy Policy page', async ({ page }) => {
        await page.goto('/legal/privacy');
        await expect(page).toHaveURL(/.*legal\/privacy/);
        await expect(page.locator('main')).toBeVisible();
    });

    test('should load Risk Disclosure page', async ({ page }) => {
        await page.goto('/legal/risk');
        await expect(page).toHaveURL(/.*legal\/risk/);
        await expect(page.locator('main')).toBeVisible();
    });

    test('should display legal content', async ({ page }) => {
        await page.goto('/legal/terms');
        await page.waitForLoadState('domcontentloaded');

        // Should have heading content
        const heading = page.getByRole('heading').first();
        await expect(heading).toBeVisible();
    });
});
