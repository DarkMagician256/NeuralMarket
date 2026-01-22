import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Portfolio & Profile Pages
 * Tests user portfolio and profile functionality
 */

test.describe('Portfolio Page', () => {
    test('should load portfolio page', async ({ page }) => {
        await page.goto('/portfolio');
        await expect(page).toHaveURL(/.*portfolio/);
    });

    test('should display portfolio content', async ({ page }) => {
        await page.goto('/portfolio');
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('main')).toBeVisible();
    });
});

test.describe('Profile Page', () => {
    test('should load profile page', async ({ page }) => {
        await page.goto('/profile');
        await expect(page).toHaveURL(/.*profile/);
    });

    test('should display profile content', async ({ page }) => {
        await page.goto('/profile');
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('main')).toBeVisible();
    });
});
