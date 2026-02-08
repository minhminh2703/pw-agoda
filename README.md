# Set up
1. `npm i` to install required modules.
2. Add file `.env` 
```
BASE_URL=https://www.agoda.com
```


# Flight Search Test Cases

## Scenario
User searches for a **one-way flight**: From **Ho Chi Minh City (SGN)** To **Valencia (VLC)** \
Departure date = **today + 2 days** \
**2 adults**, **economy class**. 

After clicking **Search**, the user views the **first available flight** in the default **Best overall** tab and verifies that price and flight details are displayed.

Homepage: https://www.agoda.com/

## Test Cases

| Test Case ID   | Title                                           | Type                  | Preconditions                          | Test Steps                                                                 | Expected Result                                                                 |
|----------------|-------------------------------------------------|-----------------------|----------------------------------------|----------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| TC-FLIGHT-001 | Successful one-way flight search and view first recommended flight details | Positive             | - Browser open<br>- On https://www.agoda.com/<br>- Internet available<br>- Flight search functional | 1. Go to Flights tab<br>2. Select **One-way**<br>3. From: Enter "Hồ Chí Minh" or "SGN" → select **Ho Chi Minh City (SGN)**<br>4. To: Enter "València" or "VLC" → select **Valencia (VLC)**<br>5. Select departure date = **today + 2 days**<br>6. Set passengers: **2 Adults**, 0 Children, 0 Infants<br>7. Select **Economy** class<br>8. Click **Search**<br>9. Wait for results page<br>10. Confirm default tab is **Best/Best overall**<br>11. Click the **first flight** in the list | - Search completes, results page loads<br>- At least one flight shown<br>- Default tab is Best overall<br>- Flight details page shows:<br> • Total price<br> • Airline(s), flight number(s), times, duration, stops, airports<br> • Passenger breakdown (2 adults, economy)<br> • No errors |
| TC-FLIGHT-002 | Search with past departure date                | Negative             | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001 steps 1–8, but select a **past date** (e.g., yesterday) | - Error message (e.g., "Departure date cannot be in the past")<br>- Search blocked<br>- No results page |
| TC-FLIGHT-003 | Origin and destination are the same            | Negative             | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001, but set both From and To to **Hồ Chí Minh (SGN)**     | - Error (e.g., "Origin and destination cannot be the same")<br>- Search blocked |
| TC-FLIGHT-004 | Missing required fields (no departure date)    | Negative             | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001 steps 1–4 & 6–8, **skip date selection**               | - Validation error for missing date<br>- Search button disabled or error shown |
| TC-FLIGHT-005 | Invalid airport code/city                      | Negative             | Same as TC-FLIGHT-001                 | Enter invalid code (e.g., "XYZ123") in From or To, do not select suggestion  | - No suggestions or "No results" in field<br>- Search blocked |
| TC-FLIGHT-006 | Maximum adults exceeded (e.g., 10 adults)      | Negative / Boundary  | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001, but set **10 Adults**                                | - Error (e.g., "Maximum 9 adults allowed")<br>- Search blocked until corrected |
| TC-FLIGHT-007 | Different cabin class – Business class         | Variation (Positive) | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001, but select **Business** class                        | - Search succeeds<br>- Results show Business class options<br>- Details reflect Business fare |
| TC-FLIGHT-008 | Different passenger composition – 1 adult + 1 child | Variation (Positive) | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001, but set **1 Adult + 1 Child** (age 5–11)             | - Search succeeds<br>- Prices include child fare<br>- Details show correct breakdown |
| TC-FLIGHT-009 | Switch sorting tab to Cheapest and select first flight | Variation (Positive) | Results page from TC-FLIGHT-001 loaded | 1. On results page, switch to **Cheapest** tab<br>2. Click **first flight** | - List sorts by price<br>- First flight is cheapest available<br>- Details and price displayed correctly |
| TC-FLIGHT-010 | No flights available for selected date         | Negative / Edge      | Same as TC-FLIGHT-001                 | Same as TC-FLIGHT-001, but choose a date with no flights (if known)         | - "No flights found" message<br>- Possible alternative date suggestions<br>- No flight list |

You can copy-paste the above section directly into your `README.md` file. It is already formatted in Markdown with a proper table and headings for good readability on GitHub/GitLab/etc.

If you want additional sections (e.g., Setup Instructions, Preconditions summary, or more test cases), let me know!