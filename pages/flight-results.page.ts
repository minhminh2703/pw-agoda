import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class FlightResultsPage extends BasePage {
    readonly flyingFromInput: Locator = this.page.getByLabel("Flying from");
    readonly flyingToInput: Locator = this.page.getByLabel("Flying to");
    readonly departureDateButton: Locator = this.page.getByTestId(
        "departure-date-input",
    );
    readonly cabinClassLabel: Locator = this.page.locator(
        '[data-element-name="flight-cabin-class"] p',
    );
    readonly passengerSelectionButton: Locator = this.page.locator(
        '[data-element-name="flight-occupancy"] button',
    );
    readonly passengerPopover: Locator = this.page.getByTestId(
        "passenger-selection",
    );
    readonly adultsCount: Locator = this.page.locator(
        '[data-component="adults-count"]',
    );
    readonly childrenCount: Locator = this.page.locator(
        '[data-component="children-count"]',
    );
    readonly infantsCount: Locator = this.page.locator(
        '[data-component="infants-count"]',
    );
    readonly flightCards: Locator = this.page.locator(
        '[data-testid="web-refresh-flights-card"]',
    );
    readonly flightDetailsExpand: Locator = this.page.locator(
        '[data-testid="flight-details-expand"]',
    );

    public async clickFlightCard(index: number): Promise<void> {
        await this.flightCards.nth(index).click();
    }

    public async isFlightDetailsExpandedVisible(
        cardIndex: number,
    ): Promise<boolean> {
        return await this.flightCards
            .nth(cardIndex)
            .locator('[data-testid="flight-details-expand"]')
            .isVisible();
    }

    public async getFlightCardsCount(): Promise<number> {
        return await this.flightCards.count();
    }

    public async getFlightPrice(cardIndex: number): Promise<string> {
        const card = this.flightCards.nth(cardIndex);
        // Get the price breakdown element and find the final price span
        const priceSpan = card.locator(
            '[data-testid="flight-price-breakdown"] span.Typographystyled__TypographyStyled-sc-1uoovui-0.ifcRDN:not([data-testid="crossout-price"])',
        );

        const prices = await priceSpan.allTextContents();
        const numericPrice = prices.find((price) => /^[0-9,]+$/.test(price));
        return numericPrice || "";
    }

    public async getFlyingFromValue(): Promise<string> {
        const value = await this.flyingFromInput.getAttribute("value");
        return value || "";
    }

    public async getFlyingToValue(): Promise<string> {
        const value = await this.flyingToInput.getAttribute("value");
        return value || "";
    }

    public async getDepartureDateText(): Promise<string> {
        const text = await this.departureDateButton.innerText();
        // Extract just the date part (e.g., "Wed, 11 Feb" from "Departure Wed, 11 Feb")
        return text.replace("Departure ", "").trim();
    }

    public async getCabinClassLabel(): Promise<string> {
        return await this.cabinClassLabel.first().innerText();
    }

    public async openPassengerSelection(): Promise<void> {
        await this.passengerSelectionButton.click();
        await this.passengerPopover.waitFor({ state: "visible" });
    }

    public async getPassengerCounts(): Promise<{
        adults: string;
        children: string;
        infants: string;
    }> {
        return {
            adults: await this.adultsCount.innerText(),
            children: await this.childrenCount.innerText(),
            infants: await this.infantsCount.innerText(),
        };
    }
}
