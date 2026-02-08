import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { Navigation } from "./navigation.page";

export class HomePage extends BasePage {
    // Navigation component
    readonly navigation: Navigation;

    // Locators
    readonly searchButton: Locator = this.page.getByRole("button", {
        name: /search/i,
    });
    readonly destinationInput: Locator =
        this.page.getByPlaceholder(/destination/i);
    readonly checkInInput: Locator = this.page.getByPlaceholder(/check.in/i);

    constructor(page: Page) {
        super(page);
        this.navigation = new Navigation(page);
    }

    async searchHotels(destination: string) {
        await this.destinationInput.fill(destination);
        await this.searchButton.click();
    }

    async getPageTitle() {
        return await this.page.title();
    }
}
