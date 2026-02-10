import { test, expect } from "@playwright/test";
import { FlightsPage } from "../pages/flights.page";
import { FlightResultsPage } from "../pages/flight-results.page";
import { NavigationTab } from "../utils/navigation.enum";
import { CabinClass } from "../utils/flight.enum";

test.describe("Flights Page Tests", () => {
    let flightsPage: FlightsPage;

    test.beforeEach(async ({ page }) => {
        flightsPage = new FlightsPage(page);
        await flightsPage.goto("/");
        // Navigate to Flights tab
        await flightsPage.navigation.navigateTo(NavigationTab.FLIGHTS);
    });

    test("TC-FLIGHT-001: Successful one-way flight search and view first recommended flight details", async () => {
        // Select origin and destination
        await flightsPage.selectOrigin("Ho Chi Minh", "SGN");
        await flightsPage.selectDestination("València", "VLC");

        // Select departure date (today + 2 days)
        const daysToAdd = 2;
        await flightsPage.selectDepartureDateFromToday(daysToAdd);

        // Calculate expected departure date
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + daysToAdd);
        const weekday = expectedDate.toLocaleDateString("en-US", {
            weekday: "short",
        });
        const day = expectedDate.getDate();
        const month = expectedDate.toLocaleDateString("en-US", {
            month: "short",
        });
        const expectedDateText = `${weekday}, ${day} ${month}`;

        // Select occupancy
        await flightsPage.setAdults(2);

        // Select cabin class
        await flightsPage.selectCabinClass(CabinClass.ECONOMY);

        // Verify search button is enabled
        expect(await flightsPage.isSearchButtonEnabled()).toBe(true);

        // Click search button
        await flightsPage.searchFlights();

        // Wait for search results to load properly
        await flightsPage.page.waitForLoadState("networkidle");
        await flightsPage.page.waitForTimeout(3000);

        // Verify search results page is displayed with correct details
        const resultsPage = new FlightResultsPage(flightsPage.page);
        expect(await resultsPage.getFlyingFromValue()).toBe(
            "Ho Chi Minh City (SGN)",
        );
        expect(await resultsPage.getFlyingToValue()).toBe("València (VLC)");

        // Verify departure date matches pattern and expected value
        const departureDateText = await resultsPage.getDepartureDateText();
        expect(departureDateText).toMatch(/^[A-Za-z]{3}, \d{1,2} [A-Za-z]{3}$/);
        expect(departureDateText).toBe(expectedDateText);

        expect(await resultsPage.getCabinClassLabel()).toBe("Economy");

        // Open passenger popover and verify counts
        await resultsPage.openPassengerSelection();
        const passengerCounts = await resultsPage.getPassengerCounts();
        expect(passengerCounts.adults).toBe("2");
        expect(passengerCounts.children).toBe("0");
        expect(passengerCounts.infants).toBe("0");

        // Choose the first flight card
        await resultsPage.clickFlightCard(0);

        // Wait for flight details page to load
        await flightsPage.page.waitForLoadState("networkidle");
        await flightsPage.page.waitForTimeout(3000);

        // Check flight price is displayed
        const flightPrice = await resultsPage.getFlightPrice(0);
        expect(flightPrice).not.toBe("");

        // Expand flight details and verify visibility
        expect(
            await resultsPage.isFlightDetailsExpandedVisible(0),
        ).toBeTruthy();
    });
});
