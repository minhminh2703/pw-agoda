export enum NavigationTab {
    HOTELS = "allRoomsTab",
    FLIGHTS = "agodaFlightsTab",
    HOMES = "homesTab",
    PACKAGES = "agodaPackagesTab",
    ACTIVITIES = "agodaActivitiesTab",
    AIRPORT_TRANSFER = "agodaJourneyTab",
}

export const NavigationTabLabels: Record<NavigationTab, string> = {
    [NavigationTab.HOTELS]: "Hotels",
    [NavigationTab.FLIGHTS]: "Flights",
    [NavigationTab.HOMES]: "Homes & Apts",
    [NavigationTab.PACKAGES]: "Flight + Hotel",
    [NavigationTab.ACTIVITIES]: "Activities",
    [NavigationTab.AIRPORT_TRANSFER]: "Airport transfer",
};
