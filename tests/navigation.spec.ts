import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { NavigationTab } from "../utils/navigation.enum";

test.describe("Navigation Tests", () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto("/");
    });

    test("should navigate to Flights tab", async () => {
        await homePage.navigation.navigateTo(NavigationTab.FLIGHTS);
        const activeTab = await homePage.navigation.getActiveTab();
        expect(activeTab).toBe(NavigationTab.FLIGHTS);
    });

    test("should navigate to Activities tab by label", async () => {
        await homePage.navigation.navigateByLabel("Activities");
        const activeTab = await homePage.navigation.getActiveTab();
        expect(activeTab).toBe(NavigationTab.ACTIVITIES);
    });

    test("should navigate through multiple tabs", async () => {
        // Hotels -> Flights
        await homePage.navigation.navigateTo(NavigationTab.FLIGHTS);
        expect(await homePage.navigation.getActiveTab()).toBe(
            NavigationTab.FLIGHTS,
        );

        // Flights -> Homes
        await homePage.navigation.navigateTo(NavigationTab.HOMES);
        expect(await homePage.navigation.getActiveTab()).toBe(
            NavigationTab.HOMES,
        );

        // Homes -> Packages
        await homePage.navigation.navigateTo(NavigationTab.PACKAGES);
        expect(await homePage.navigation.getActiveTab()).toBe(
            NavigationTab.PACKAGES,
        );
    });
});
