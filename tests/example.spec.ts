import { test, expect } from "@playwright/test";

test.describe("Agoda Test Suite", () => {
    test("should load Agoda homepage", async ({ page }) => {
        await page.goto("/"); // Uses BASE_URL from .env
        await expect(page).toHaveTitle(/Agoda/);
    });

    test("should navigate to hotels", async ({ page }) => {
        await page.goto("/"); // Uses BASE_URL
        // Add your Agoda test steps here
    });
});
