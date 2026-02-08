import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { Navigation } from "./navigation.page";

export enum TripType {
    ONE_WAY = "one-way",
    ROUND_TRIP = "round-trip",
}

export class FlightsPage extends BasePage {
    readonly navigation: Navigation;
    readonly oneWayOption: Locator = this.page.locator(
        'input[type="radio"][value="one-way"]',
    );
    readonly roundTripOption: Locator = this.page.locator(
        'input[type="radio"][value="round-trip"]',
    );
    readonly originInput: Locator = this.page.locator(
        'input[data-selenium="flight-origin-search-input"]',
    );
    readonly destinationInput: Locator = this.page.locator(
        'input[data-selenium="flight-destination-search-input"]',
    );
    readonly swapButton: Locator = this.page.locator(
        'button[data-element-name="flight-route-swap"]',
    );
    readonly originDropdown: Locator = this.page.locator(
        "#autocompleteSearch-origin",
    );
    readonly destinationDropdown: Locator = this.page.locator(
        "#autocompleteSearch-destination",
    );

    constructor(page: Page) {
        super(page);
        this.navigation = new Navigation(page);
    }

    /**
     * Select trip type (One-way or Round-trip)
     * @param tripType - The trip type to select
     * @example await flightsPage.selectTripType(TripType.ROUND_TRIP);
     */
    async selectTripType(tripType: TripType): Promise<void> {
        const option =
            tripType === TripType.ONE_WAY
                ? this.oneWayOption
                : this.roundTripOption;
        await option.click();
    }

    /**
     * Get currently selected trip type
     * @returns The selected TripType or null if none selected
     */
    async getSelectedTripType(): Promise<TripType | null> {
        const isOneWayChecked = await this.oneWayOption.isChecked();
        return isOneWayChecked ? TripType.ONE_WAY : TripType.ROUND_TRIP;
    }

    /**
     * Type origin airport and select from dropdown
     * @param searchText - Text to search (e.g., "Ho Chi Minh")
     * @param airportCode - Airport code to select (e.g., "SGN")
     * @example await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
     */
    async selectOrigin(searchText: string, airportCode: string): Promise<void> {
        // Type in the origin input
        await this.originInput.fill(searchText);
        await this.originInput.click();
        await this.page.waitForTimeout(500); // Wait for dropdown to appear

        // Select the FIRST option matching the airport code that is NOT disabled
        const option = this.page
            .locator(
                `li[role="option"][data-objectid="${airportCode}"]:not([aria-disabled="true"])`,
            )
            .first();
        await option.click();
    }

    /**
     * Type destination airport and select from dropdown
     * @param searchText - Text to search (e.g., "Bangkok")
     * @param airportCode - Airport code to select (e.g., "BKK")
     * @example await flightsPage.selectDestination("Bangkok", "BKK");
     */
    async selectDestination(
        searchText: string,
        airportCode: string,
    ): Promise<void> {
        // Type in the destination input
        await this.destinationInput.fill(searchText);
        await this.destinationInput.click();

        // Select the FIRST option matching the airport code that is NOT disabled
        const option = this.page
            .locator(
                `li[role="option"][data-objectid="${airportCode}"]:not([aria-disabled="true"])`,
            )
            .first();
        await option.click();
    }

    /**
     * Get origin airport input value
     */
    async getOriginValue(): Promise<string> {
        return await this.originInput.inputValue();
    }

    /**
     * Get destination airport input value
     */
    async getDestinationValue(): Promise<string> {
        return await this.destinationInput.inputValue();
    }

    /**
     * Swap origin and destination airports
     */
    async swapAirports(): Promise<void> {
        await this.swapButton.click();
    }

    /**
     * Clear origin input
     */
    async clearOrigin(): Promise<void> {
        await this.originInput.clear();
    }

    /**
     * Clear destination input
     */
    async clearDestination(): Promise<void> {
        await this.destinationInput.clear();
    }

    /**
     * Check if origin dropdown is visible
     */
    async isOriginDropdownVisible(): Promise<boolean> {
        return await this.originDropdown.isVisible();
    }

    /**
     * Check if destination dropdown is visible
     */
    async isDestinationDropdownVisible(): Promise<boolean> {
        return await this.destinationDropdown.isVisible();
    }

    /**
     * Get all available enabled options from a dropdown
     * @param inputField - The input field ("origin" or "destination")
     */
    async getAvailableAirports(
        inputField: "origin" | "destination",
    ): Promise<Array<{ name: string; code: string }>> {
        const container =
            inputField === "origin"
                ? this.originDropdown
                : this.destinationDropdown;

        const options = await container
            .locator('li[role="option"]:not([aria-disabled="true"])')
            .all();

        const airports = [];
        for (const option of options) {
            const code = await option.getAttribute("data-objectid");
            const text = await option.getAttribute("data-text");
            if (code && text) {
                airports.push({ name: text, code });
            }
        }
        return airports;
    }
}
