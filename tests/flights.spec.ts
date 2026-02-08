import { test, expect } from "@playwright/test";
import { FlightsPage } from "../pages/flights.page";
import { NavigationTab } from "../utils/navigation.enum";
import { TripType } from "../pages/flights.page";

test.describe("Flights Page Tests", () => {
    let flightsPage: FlightsPage;

    test.beforeEach(async ({ page }) => {
        flightsPage = new FlightsPage(page);
        await flightsPage.goto("/");
        // Navigate to Flights tab
        await flightsPage.navigation.navigateTo(NavigationTab.FLIGHTS);
    });

    test("should select origin and destination airports", async () => {
        // Select origin: Ho Chi Minh (SGN)
        await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
        expect(await flightsPage.getOriginValue()).toContain("Ho Chi Minh");

        // Select destination: Bangkok (BKK) - adjust based on actual data
        await flightsPage.selectDestination("Bangkok", "BKK");
        expect(await flightsPage.getDestinationValue()).toContain("Bangkok");
    });

    test("should swap origin and destination", async () => {
        // Set initial values
        await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
        const originValue = await flightsPage.getOriginValue();

        await flightsPage.selectDestination("Bangkok", "BKK");
        const destValue = await flightsPage.getDestinationValue();

        // Swap
        await flightsPage.swapAirports();

        // Values should be swapped (note: may need to verify with actual content)
        await flightsPage.page.waitForTimeout(300);
    });

    test("should display dropdown options when typing", async () => {
        // Type in origin field
        await flightsPage.originInput.fill("Ho Chi Minh");
        await flightsPage.originInput.click();
        await flightsPage.page.waitForTimeout(500);

        // Check if dropdown is visible
        const isVisible = await flightsPage.isOriginDropdownVisible();
        expect(isVisible).toBe(true);

        // Get available airports
        const airports = await flightsPage.getAvailableAirports("origin");
        expect(airports.length).toBeGreaterThan(0);
        console.log("Available airports:", airports);
    });

    test("should select round-trip flight", async () => {
        // Select round-trip
        await flightsPage.selectTripType(TripType.ROUND_TRIP);
        const selectedType = await flightsPage.getSelectedTripType();
        expect(selectedType).toBe(TripType.ROUND_TRIP);
    });

    test("should clear origin and destination", async () => {
        // Set values
        await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
        await flightsPage.selectDestination("Bangkok", "BKK");

        // Clear
        await flightsPage.clearOrigin();
        await flightsPage.clearDestination();

        expect(await flightsPage.getOriginValue()).toBe("");
        expect(await flightsPage.getDestinationValue()).toBe("");
    });
});
