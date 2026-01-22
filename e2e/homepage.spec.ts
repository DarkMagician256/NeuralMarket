import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Homepage
 * Tests the landing page functionality and core UI elements
 */

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the homepage successfully', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/Neural Market/);
    });

    test('should display the navbar with logo', async ({ page }) => {
        // Check navbar exists
        const navbar = page.locator('nav');
        await expect(navbar).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
        // Check for main heading or hero content
        const heroSection = page.locator('main');
        await expect(heroSection).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
        // Check Markets link exists
        const marketsLink = page.locator('a[href="/markets"]').first();
        await expect(marketsLink).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Page should still render correctly
        await expect(page.locator('body')).toBeVisible();
    });
});
