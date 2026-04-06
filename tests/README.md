# Map Feature Playwright Tests

This directory contains comprehensive end-to-end tests for the interactive map feature using Playwright.

## Test Coverage

The test suite (`map.spec.ts`) covers all major functionality of the map feature:

### 1. Location Input Tests
- ✅ Location input renders on initial load with search and geolocation buttons
- ✅ City autocomplete shows suggestions as user types
- ✅ City selection from autocomplete triggers map navigation
- ✅ Manual form submission works with first suggestion

### 2. Map Display Tests
- ✅ Map renders with markers after location selection
- ✅ User location label displays in header
- ✅ Province name displays in header after detection

### 3. Navigation & Tabs Tests
- ✅ Tab navigation buttons (Careers, Colleges, Insights) display
- ✅ Careers tab shows content by default
- ✅ Tabs can be switched smoothly
- ✅ Back button returns to location input screen
- ✅ Back button clears selections

### 4. Search Functionality Tests
- ✅ Search box is visible in results panel
- ✅ Search query filters career results

### 5. Layer Controls Tests
- ✅ Layer toggle checkboxes display (Demand, Colleges, Careers)
- ✅ Layer visibility can be toggled on/off

### 6. Insights Tab Tests
- ✅ Job market statistics display (career count, salary data)
- ✅ Industry breakdown section renders
- ✅ Education landscape section displays
- ✅ Top employers section shows data

### 7. Careers Tab Tests
- ✅ Career cards render and display data

### 8. Colleges Tab Tests
- ✅ Universities and TVET sub-tabs display
- ✅ Universities tab shows college list by default
- ✅ Users can switch between universities and TVET tabs

## Running the Tests

### Prerequisites
- Node.js 16+ installed
- npm dependencies installed (`npm install`)
- Dev server will start automatically during tests

### Commands

**Run all tests:**
```bash
npm test
```

**Run tests with UI (interactive):**
```bash
npm run test:ui
```
This opens the Playwright Inspector where you can see and debug tests in real-time.

**Run tests in headed mode (see browser):**
```bash
npm run test:headed
```

**Debug a specific test:**
```bash
npm run test:debug
```

**Run specific test file:**
```bash
npx playwright test tests/map.spec.ts
```

**Run specific test group:**
```bash
npx playwright test -g "Location Input"
```

## Test Configuration

The tests are configured in `playwright.config.ts`:

- **Base URL:** `http://localhost:3000`
- **Browser:** Chromium (Desktop Chrome)
- **Viewport:** 1280x800
- **Timeout:** 30 seconds per test
- **Auto-startup:** Dev server starts automatically
- **Screenshots:** Only captured on test failure
- **Video/Trace:** Captured on first retry if test fails

## Geolocation Mocking

The tests mock browser geolocation to simulate a user location (Johannesburg by default):
```typescript
await page.context().grantPermissions(['geolocation']);
await page.context().setGeolocation({ latitude: -26.2023, longitude: 28.0436 });
```

This allows testing the "Use My Location" feature without requiring actual GPS.

## Key Test Patterns

### Waiting for Elements
Tests use `waitFor()` with timeouts to handle async rendering:
```typescript
await element.waitFor({ state: 'visible', timeout: 5000 });
```

### Selecting Cities from Autocomplete
Tests use Playwright locators to find and click suggestions:
```typescript
const suggestion = page.locator('button').filter({ has: page.locator('text=Johannesburg') }).first();
await suggestion.click();
```

### Scrolling Within Panels
For scrollable content areas, tests use `evaluate()` to scroll:
```typescript
await page.locator('div.overflow-y-auto').evaluate(el => {
  el.scrollTop = el.scrollHeight;
});
```

## Debugging

### View Test Report
After running tests, an HTML report is generated at `playwright-report/index.html`:
```bash
npx playwright show-report
```

### Enable Debug Mode
Run tests with `--debug` flag to step through code:
```bash
npm run test:debug
```

### View Captured Screenshots/Videos
On test failure, screenshots are saved. Check:
- Screenshots: `test-results/`
- HTML Report: `playwright-report/`

## Continuous Integration

For CI/CD pipelines, run:
```bash
npm test -- --reporter=list
```

This provides simple terminal output suitable for logs.

## Troubleshooting

### "Port 3000 already in use"
Kill the existing process:
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Tests timeout
Increase timeout in specific tests:
```typescript
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // test code...
});
```

### Geolocation not working
Ensure browser permissions are granted:
```typescript
await page.context().grantPermissions(['geolocation']);
```

## Future Enhancements

- Add mobile viewport tests (375x667)
- Add visual regression tests for heatmap rendering
- Add performance benchmarks for map rendering
- Add accessibility tests (WCAG compliance)
- Add multi-browser testing (Firefox, Safari)
- Add tests for career detail modal opening
- Add tests for cost of living breakdown rendering
- Add tests for bursary data filtering
