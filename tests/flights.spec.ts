import { test, expect } from "@playwright/test";
import { FlightsPage } from "../pages/flights.page";
import { NavigationTab } from "../utils/navigation.enum";
import { TripType, CabinClass } from "../utils/flight.enum";

test.describe("Flights Page Tests", () => {
    let flightsPage: FlightsPage;

    test.beforeEach(async ({ page }) => {
        flightsPage = new FlightsPage(page);
        await flightsPage.goto("/");
        // Navigate to Flights tab
        await flightsPage.navigation.navigateTo(NavigationTab.FLIGHTS);
    });

    test("should complete full flight search", async () => {
        // Select origin and destination
        await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
        await flightsPage.selectDestination("Bangkok", "BKK");

        // Select departure date (today + 2 days)
        await flightsPage.selectDepartureDateFromToday(2);

        // Select occupancy
        await flightsPage.setAdults(2);

        // Select cabin class
        await flightsPage.selectCabinClass(CabinClass.ECONOMY);

        // Verify search button is enabled
        expect(await flightsPage.isSearchButtonEnabled()).toBe(true);

        // Click search button
        await flightsPage.searchFlights();

        // Wait for search results to load
        await flightsPage.page.waitForLoadState("domcontentloaded");
    });
});
