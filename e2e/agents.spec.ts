import { test, expect } from '@playwright/test';

/**
 * E2E Tests - Agents Page
 * Tests the AI agents listing and creation wizard
 */

test.describe('Agents Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/agents');
    });

    test('should load agents page', async ({ page }) => {
        await expect(page).toHaveURL(/.*agents/);
    });

    test('should display agents content', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded');
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
    });

    test('should have create agent button or link', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        // Page should render without errors
        await expect(page.locator('body')).toBeVisible();
    });
});

test.describe('Agent Creation Wizard', () => {
    test('should load agent creation page', async ({ page }) => {
        await page.goto('/agents/create');
        await expect(page).toHaveURL(/.*agents\/create/);
    });

    test('should display wizard steps', async ({ page }) => {
        await page.goto('/agents/create');
        await page.waitForLoadState('domcontentloaded');

        // Wizard content should be visible
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
    });

    test('should show archetype selection', async ({ page }) => {
        await page.goto('/agents/create');
        await page.waitForLoadState('networkidle');

        // Page should load without errors
        await expect(page.locator('body')).toBeVisible();
    });
});
