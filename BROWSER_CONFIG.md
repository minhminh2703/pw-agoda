# Browser Configuration

## How to Select Browsers for Testing

You can now control which browser(s) to run tests on using the `BROWSERS` environment variable in your `.env` file.

### Configuration Options

Edit the `BROWSERS` variable in `.env`:

#### Run on a single browser:
```env
BROWSERS=chromium
```

#### Run on multiple browsers:
```env
BROWSERS=chromium,firefox
```

or

```env
BROWSERS=chromium,firefox,webkit
```

#### Run on all browsers (default):
Comment out or remove the BROWSERS variable:
```env
# BROWSERS=chromium
```

or set it to empty:
```env
BROWSERS=
```

### Available Browsers

- `chromium` - Desktop Chrome
- `firefox` - Desktop Firefox
- `webkit` - Desktop Safari

### Examples

**Fast development (single browser):**
```env
BROWSERS=chromium
```

**Cross-browser testing (all browsers):**
```env
# BROWSERS=
```

**Specific combination:**
```env
BROWSERS=chromium,firefox
```

### Running Tests

After setting the `BROWSERS` variable, simply run your tests as normal:

```bash
npx playwright test
```

The tests will automatically run on only the browsers specified in your `.env` file.
