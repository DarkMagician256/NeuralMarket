import { test, expect } from '@playwright/test';

/**
 * E2E Tests - SEO & Meta Tags
 * Tests SEO metadata, Open Graph, and Twitter cards
 */

test.describe('SEO & Meta Tags', () => {
    test('should have correct title tag', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Neural Market/);
    });

    test('should have meta description', async ({ page }) => {
        await page.goto('/');
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /.+/);
    });

    test('should have Open Graph tags', async ({ page }) => {
        await page.goto('/');

        const ogTitle = page.locator('meta[property="og:title"]');
        const ogDescription = page.locator('meta[property="og:description"]');
        const ogImage = page.locator('meta[property="og:image"]');

        await expect(ogTitle).toHaveAttribute('content', /.+/);
        await expect(ogDescription).toHaveAttribute('content', /.+/);
        await expect(ogImage).toHaveAttribute('content', /.+/);
    });

    test('should have Twitter card tags', async ({ page }) => {
        await page.goto('/');

        const twitterCard = page.locator('meta[name="twitter:card"]');
        await expect(twitterCard).toHaveAttribute('content', /.+/);
    });

    test('should have viewport meta tag', async ({ page }) => {
        await page.goto('/');
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveAttribute('content', /width=device-width/);
    });

    test('should have manifest link for PWA', async ({ page }) => {
        await page.goto('/');
        const manifest = page.locator('link[rel="manifest"]');
        await expect(manifest).toHaveAttribute('href', /manifest\.json/);
    });

    test('should have favicon', async ({ page }) => {
        await page.goto('/');
        const favicon = page.locator('link[rel="icon"]');
        await expect(favicon).toHaveAttribute('href', /.+/);
    });

    test('should have theme-color meta tag', async ({ page }) => {
        await page.goto('/');
        const themeColor = page.locator('meta[name="theme-color"]');
        await expect(themeColor).toHaveAttribute('content', /.+/);
    });
});
