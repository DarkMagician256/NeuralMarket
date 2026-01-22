import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Navigation & Responsiveness
 * Tests navigation links and responsive design
 */

test.describe('Navigation', () => {
    test('should navigate between main pages', async ({ page }) => {
        // Start at home
        await page.goto('/');

        // Navigate to markets
        await page.click('a[href="/markets"]');
        await expect(page).toHaveURL(/.*markets/);

        // Navigate to leaderboard
        await page.click('a[href="/leaderboard"]');
        await expect(page).toHaveURL(/.*leaderboard/);
    });

    test('should have consistent navbar across pages', async ({ page }) => {
        const pages = ['/', '/markets', '/leaderboard', '/governance'];

        for (const url of pages) {
            await page.goto(url);
            const navbar = page.locator('nav');
            await expect(navbar).toBeVisible();
        }
    });
});

test.describe('Responsive Design', () => {
    const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1440, height: 900 },
    ];

    for (const viewport of viewports) {
        test(`should render correctly on ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto('/');

            // Page should render
            await expect(page.locator('body')).toBeVisible();

            // Navbar should be visible
            const navbar = page.locator('nav');
            await expect(navbar).toBeVisible();
        });
    }

    test('should handle mobile menu if present', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Page should render without errors
        await expect(page.locator('body')).toBeVisible();
    });
});
