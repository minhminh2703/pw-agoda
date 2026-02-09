import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { Navigation } from "./navigation.page";
import { TripType, CabinClass } from "../utils/flight.enum";

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

    // Departure Date Picker
    readonly departureDatePicker: Locator =
        this.page.locator("#flight-departure");
    readonly datePickerPopup: Locator = this.page.locator(
        ".Popup__content.DateSelector__PopupContent",
    );

    // Search Button
    readonly searchButton: Locator = this.page.locator(
        'button[data-element-name="flight-search"]',
    );

    // Occupancy Selector Panel
    readonly occupancySelectorPanel: Locator = this.page.locator(
        'div[data-element-name="occupancy-selector-panel"]',
    );

    // Adults Controls
    readonly adultsDecreaseButton: Locator = this.page.locator(
        'button[data-element-name="flight-occupancy-adult-decrease"]',
    );
    readonly adultsIncreaseButton: Locator = this.page.locator(
        'button[data-element-name="flight-occupancy-adult-increase"]',
    );
    readonly adultsNumber: Locator = this.page.locator(
        'span[data-component="flight-occupancy-adult-number"]',
    );

    // Children Controls
    readonly childrenDecreaseButton: Locator = this.page.locator(
        'button[data-element-name="flight-occupancy-children-decrease"]',
    );
    readonly childrenIncreaseButton: Locator = this.page.locator(
        'button[data-element-name="flight-occupancy-children-increase"]',
    );
    readonly childrenNumber: Locator = this.page.locator(
        'span[data-component="flight-occupancy-children-number"]',
    );

    // Infants Controls
    readonly infantsDecreaseButton: Locator = this.page.locator(
        'button[data-element-name="flight-occupancy-infant-decrease"]',
    );
    readonly infantsIncreaseButton: Locator = this.page.locator(
        'button[data-element-name="flight-occupancy-infant-increase"]',
    );
    readonly infantsNumber: Locator = this.page.locator(
        'span[data-component="flight-occupancy-infant-number"]',
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
    public async selectTripType(tripType: TripType): Promise<void> {
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
    public async getSelectedTripType(): Promise<TripType | null> {
        const isOneWayChecked = await this.oneWayOption.isChecked();
        return isOneWayChecked ? TripType.ONE_WAY : TripType.ROUND_TRIP;
    }

    /**
     * Type origin airport and select from dropdown
     * @param searchText - Text to search (e.g., "Ho Chi Minh")
     * @param airportCode - Airport code to select (e.g., "SGN")
     * @example await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
     */
    public async selectOrigin(
        searchText: string,
        airportCode: string,
    ): Promise<void> {
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
    public async selectDestination(
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
    public async getOriginValue(): Promise<string> {
        return await this.originInput.inputValue();
    }

    /**
     * Get destination airport input value
     */
    public async getDestinationValue(): Promise<string> {
        return await this.destinationInput.inputValue();
    }

    /**
     * Swap origin and destination airports
     */
    public async swapAirports(): Promise<void> {
        await this.swapButton.click();
    }

    /**
     * Clear origin input
     */
    public async clearOrigin(): Promise<void> {
        await this.originInput.clear();
    }

    /**
     * Clear destination input
     */
    public async clearDestination(): Promise<void> {
        await this.destinationInput.clear();
    }

    /**
     * Check if origin dropdown is visible
     */
    public async isOriginDropdownVisible(): Promise<boolean> {
        return await this.originDropdown.isVisible();
    }

    /**
     * Check if destination dropdown is visible
     */
    public async isDestinationDropdownVisible(): Promise<boolean> {
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

    /**
     * Select a specific date from the departure calendar
     * @param date - Date object or string in format "YYYY-MM-DD"
     * @example await flightsPage.selectDepartureDate("2026-02-10");
     */
    async selectDepartureDate(date: Date | string): Promise<void> {
        // Convert date to YYYY-MM-DD format
        let dateString: string;
        if (date instanceof Date) {
            dateString = date.toISOString().split("T")[0];
        } else {
            dateString = date;
        }

        // Parse the date to get day
        const [year, month, day] = dateString.split("-");
        const dayNum = parseInt(day, 10);
        const targetText = dayNum.toString();

        // Open calendar if not already open
        // await this.departureDatePicker.click();

        // Wait for the listbox to be present (calendar container)
        await this.page
            .locator("role=listbox")
            .first()
            .waitFor({ state: "attached", timeout: 5000 });

        // Give calendar content time to render - longer initial wait
        await this.page.waitForTimeout(1000);

        // Get the listbox/calendar container
        const calendarContainer = this.page.locator("role=listbox").first();

        // Find and click the date button with matching text within the calendar
        for (let attempt = 0; attempt < 10; attempt++) {
            try {
                const buttons = await calendarContainer
                    .locator("role=button")
                    .all();

                for (const btn of buttons) {
                    const text = await btn.textContent();
                    if (text && text.trim() === targetText) {
                        // Make sure button is visible before clicking
                        await btn.scrollIntoViewIfNeeded();
                        await btn.click({ force: true });
                        return;
                    }
                }
            } catch (e) {
                // Ignore errors during iteration
            }

            // If not found, wait before retrying
            if (attempt < 9) {
                await this.page.waitForTimeout(500);
            }
        }

        throw new Error(
            `Could not find date button for day ${dayNum} in calendar after 10 attempts`,
        );
    }

    /**
     * Select departure date as today + N days
     * @param daysFromToday - Number of days to add from today (e.g., 2 for +2 days)
     * @example await flightsPage.selectDepartureDateFromToday(2); // Tomorrow + 2 days
     */
    async selectDepartureDateFromToday(daysFromToday: number): Promise<void> {
        // Calculate the target date
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + daysFromToday);

        // Convert to YYYY-MM-DD format
        const dateString = targetDate.toISOString().split("T")[0];

        // Select the date
        await this.selectDepartureDate(dateString);
    }

    /**
     * Get the currently selected departure date
     * @returns Date string in format "YYYY-MM-DD" or null if not set
     */
    async getSelectedDepartureDate(): Promise<string | null> {
        const dateElement = this.page.locator(
            'div[data-element-name="flight-departure"] span',
        );
        try {
            const text = await dateElement.textContent();
            return text ? text.trim() : null;
        } catch {
            return null;
        }
    }

    /**
     * Click the Search Flights button
     * @example await flightsPage.searchFlights();
     */
    async searchFlights(): Promise<void> {
        await this.searchButton.click();
    }

    /**
     * Check if the Search Flights button is visible
     */
    async isSearchButtonVisible(): Promise<boolean> {
        return await this.searchButton.isVisible();
    }

    /**
     * Check if the Search Flights button is enabled
     */
    async isSearchButtonEnabled(): Promise<boolean> {
        return !(await this.searchButton.isDisabled());
    }

    /**
     * Set number of adults
     * @param count - Number of adults (minimum 1)
     * @example await flightsPage.setAdults(2);
     */
    async setAdults(count: number): Promise<void> {
        if (count < 1) {
            throw new Error("Minimum 1 adult required");
        }

        // Get current count
        const currentText = await this.adultsNumber.textContent();
        const currentCount = parseInt(currentText?.trim() || "1");

        // Adjust count by clicking increase/decrease buttons
        if (count > currentCount) {
            for (let i = 0; i < count - currentCount; i++) {
                await this.adultsIncreaseButton.click();
            }
        } else if (count < currentCount) {
            for (let i = 0; i < currentCount - count; i++) {
                await this.adultsDecreaseButton.click();
            }
        }
    }

    /**
     * Set number of children
     * @param count - Number of children (0 or more)
     * @example await flightsPage.setChildren(1);
     */
    async setChildren(count: number): Promise<void> {
        if (count < 0) {
            throw new Error("Children count cannot be negative");
        }

        // Get current count
        const currentText = await this.childrenNumber.textContent();
        const currentCount = parseInt(currentText?.trim() || "0");

        // Adjust count by clicking increase/decrease buttons
        if (count > currentCount) {
            for (let i = 0; i < count - currentCount; i++) {
                await this.childrenIncreaseButton.click();
            }
        } else if (count < currentCount) {
            for (let i = 0; i < currentCount - count; i++) {
                await this.childrenDecreaseButton.click();
            }
        }
    }

    /**
     * Set number of infants
     * @param count - Number of infants (0 or more)
     * @example await flightsPage.setInfants(1);
     */
    async setInfants(count: number): Promise<void> {
        if (count < 0) {
            throw new Error("Infants count cannot be negative");
        }

        // Get current count
        const currentText = await this.infantsNumber.textContent();
        const currentCount = parseInt(currentText?.trim() || "0");

        // Adjust count by clicking increase/decrease buttons
        if (count > currentCount) {
            for (let i = 0; i < count - currentCount; i++) {
                await this.infantsIncreaseButton.click();
            }
        } else if (count < currentCount) {
            for (let i = 0; i < currentCount - count; i++) {
                await this.infantsDecreaseButton.click();
            }
        }
    }

    /**
     * Get current occupancy counts
     * @returns Object with counts of adults, children, and infants
     */
    public async getOccupancy(): Promise<{
        adults: number;
        children: number;
        infants: number;
    }> {
        const adultsText = await this.adultsNumber.textContent();
        const childrenText = await this.childrenNumber.textContent();
        const infantsText = await this.infantsNumber.textContent();

        return {
            adults: parseInt(adultsText?.trim() || "1"),
            children: parseInt(childrenText?.trim() || "0"),
            infants: parseInt(infantsText?.trim() || "0"),
        };
    }

    /**
     * Select cabin class
     * @param cabinClass - Cabin class to select
     * @example await flightsPage.selectCabinClass(CabinClass.BUSINESS);
     */
    async selectCabinClass(cabinClass: CabinClass): Promise<void> {
        const cabinButton = this.page.locator(
            `button[data-element-name="flight-cabin-class"][data-element-object-id="${cabinClass}"]`,
        );
        await cabinButton.click();
    }

    /**
     * Get currently selected cabin class
     * @returns The selected cabin class or null
     */
    async getSelectedCabinClass(): Promise<CabinClass | null> {
        const selectedButton = this.page.locator(
            'button[data-element-name="flight-cabin-class"][aria-pressed="true"]',
        );
        try {
            const cabinClass = await selectedButton.getAttribute(
                "data-element-object-id",
            );
            return (cabinClass as CabinClass) || null;
        } catch {
            return null;
        }
    }

    /**
     * Check if a cabin class button is visible
     * @param cabinClass - The cabin class to check
     */
    async isCabinClassAvailable(cabinClass: CabinClass): Promise<boolean> {
        const cabinButton = this.page.locator(
            `button[data-element-name="flight-cabin-class"][data-element-object-id="${cabinClass}"]`,
        );
        return await cabinButton.isVisible();
    }
}
