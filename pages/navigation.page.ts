import { Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { NavigationTab } from "../utils/navigation.enum";

/**
 * Navigation Component - Handles all navigation bar interactions
 * Best Practice: Separated into its own class for reusability across pages
 */
export class Navigation extends BasePage {
    // Container for all tabs
    readonly tabsContainer: Locator = this.page.locator("#Tabs-Container");

    /**
     * Map of navigation tabs using data-selenium attributes (most stable)
     * This approach is preferred over class names or IDs which may change
     */
    getTabByName(tab: NavigationTab): Locator {
        return this.page.getByTestId(tab);
    }

    /**
     * Alternative method using data-selenium attribute selector
     * More reliable than getByTestId if testId is not available
     */
    getTabByDataSelenium(tab: NavigationTab): Locator {
        return this.page.locator(`[data-selenium="${tab}"]`);
    }

    /**
     * Navigate to a specific section
     * @param tab - The navigation tab to click
     * @example await nav.navigateTo(NavigationTab.FLIGHTS);
     */
    async navigateTo(tab: NavigationTab): Promise<void> {
        const tabElement = this.getTabByDataSelenium(tab);
        await tabElement.click();
        await this.waitForNavigation();
    }

    /**
     * Navigate by label name (e.g., "Hotels", "Flights")
     * @param label - The visible text of the tab
     * @example await nav.navigateByLabel('Flights');
     */
    async navigateByLabel(label: string): Promise<void> {
        const tabElement = this.page
            .locator(`[role="tab"]`)
            .filter({ hasText: label });
        await tabElement.click();
        await this.waitForNavigation();
    }

    /**
     * Get the currently active tab
     * @returns The NavigationTab enum value of the active tab
     */
    async getActiveTab(): Promise<NavigationTab | null> {
        // Scope the locator to the tabs container to avoid matching other tabs on the page
        const activeTab = this.tabsContainer.locator(
            '[role="tab"][aria-selected="true"]',
        );
        const dataSelenium = await activeTab.getAttribute("data-selenium");
        return (dataSelenium as NavigationTab) || null;
    }

    /**
     * Check if a tab is visible
     * @param tab - The navigation tab to check
     */
    async isTabVisible(tab: NavigationTab): Promise<boolean> {
        return await this.getTabByDataSelenium(tab).isVisible();
    }

    /**
     * Check if a tab is enabled (clickable)
     * @param tab - The navigation tab to check
     */
    async isTabEnabled(tab: NavigationTab): Promise<boolean> {
        const tabElement = this.getTabByDataSelenium(tab);
        return !(await tabElement.isDisabled());
    }

    /**
     * Get all available navigation tabs
     */
    async getAllAvailableTabs(): Promise<NavigationTab[]> {
        const tabs = await this.page
            .locator('[role="tab"]')
            .evaluateAll(
                (elements) =>
                    elements
                        .map((el) => el.getAttribute("data-selenium"))
                        .filter((attr) => attr !== null) as string[],
            );
        return tabs as NavigationTab[];
    }

    /**
     * Wait for navigation to complete (handles tab switching animations/loads)
     * Uses 'domcontentloaded' instead of 'networkidle' to avoid timeout on SPAs
     * with continuous background requests
     */
    private async waitForNavigation(): Promise<void> {
        // Wait for DOM to be loaded (more suitable for tab switching on SPAs)
        await this.page.waitForLoadState("domcontentloaded");
        // Optional: Add small delay for any animations/content rendering
        await this.page.waitForTimeout(500);
    }
}
