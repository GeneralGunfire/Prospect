# Quick Start: Testing the Map Feature

## 30-Second Setup

```bash
# Install dependencies (if not already done)
npm install

# Run tests
npm test
```

That's it! Tests will:
1. Start dev server automatically on port 3000
2. Run all map feature tests in Chromium
3. Generate HTML report in `playwright-report/`

## What Gets Tested

### Quick Smoke Test (2 minutes)
Best for quick verification that map works:

```bash
# Just run location input tests (fastest)
npx playwright test tests/map.spec.ts --grep "Location Input"
```

### Full Test Suite (5-10 minutes)
Complete feature validation:

```bash
# Run all map tests
npx playwright test tests/map.spec.ts
```

### Interactive Testing (Best for debugging)
See what's happening in real-time:

```bash
# Opens Playwright Inspector UI
npm run test:ui

# Or see the actual browser
npm run test:headed
```

## Key Test Paths

These are the main user flows being tested:

### Path 1: Manual Location Selection
1. User sees location input screen
2. Types city name (e.g., "Johannesburg")
3. Sees autocomplete suggestions
4. Clicks suggestion
5. Map loads with tabs and search

### Path 2: Geolocation ("Use My Location")
1. User clicks "Use My Location" button
2. Browser requests location permission (auto-granted in tests)
3. Coordinates detected → province calculated
4. Map loads showing detected location

### Path 3: Exploration
1. **Search**: Type keyword → filters results
2. **Tabs**: Switch between Careers | Colleges | Insights
3. **Layers**: Toggle demand/colleges/careers on map
4. **Back**: Return to location selection

## Viewing Test Results

### HTML Report (Best View)
```bash
# After tests complete
npx playwright show-report
```
Opens full test report with screenshots/videos.

### Terminal Report
```bash
# See results in terminal
npm test -- --reporter=list
```

## Debugging a Failing Test

1. **Identify failing test** from report
2. **Run with debug mode**:
   ```bash
   npm run test:debug
   ```
   Use Step Over/Step Into to debug

3. **Or run in headed mode** to see browser:
   ```bash
   npm run test:headed
   ```

4. **Check screenshots** in `test-results/` folder

## Test Environment

- **Server**: Starts automatically at `http://localhost:3000`
- **Browser**: Chromium (Desktop Chrome)
- **Geolocation**: Mocked to Johannesburg coordinates
- **Permissions**: Browser geolocation auto-granted
- **Viewport**: 1280x800 (desktop size)

## Manual Testing Checklist

If you prefer manual testing instead:

```
[ ] Location Input
  [ ] Page loads with "Job Market Map 🗺️" heading
  [ ] Input accepts city name
  [ ] Suggestions appear while typing
  [ ] Click suggestion → transitions to map

[ ] Map Display
  [ ] Map canvas visible and zoomable
  [ ] Location label shows (e.g., "Johannesburg, Gauteng")
  [ ] Province name displays

[ ] Tabs
  [ ] Careers tab shows career cards (default)
  [ ] Colleges tab shows university/TVET list
  [ ] Insights tab shows stats + charts

[ ] Search
  [ ] Search box accepts input
  [ ] Typing filters results

[ ] Back Button
  [ ] Green "← Back" button visible
  [ ] Clicking returns to location input

[ ] Geolocation (if on HTTPS/localhost)
  [ ] Click "Use My Location"
  [ ] Accept location permission
  [ ] Map loads with detected location
```

## Troubleshooting

### "Port 3000 already in use"
```bash
# Kill existing process
lsof -i :3000 | grep node | awk '{print $2}' | xargs kill -9
```

### Tests hang or timeout
Increase timeout:
```bash
npm test -- --timeout=60000
```

### Geolocation tests fail
Ensure:
- Browser has geolocation capability (Chrome/Firefox)
- HTTPS or localhost (geolocation requirement)
- Test setup grants permission: `grantPermissions(['geolocation'])`

### Screenshots show blank page
Check:
- Dev server started successfully
- No JavaScript errors in console
- Province detection working (check MapPage console.log)

## Quick Performance Check

Test actual responsiveness:
```bash
npm run test:headed
```
Watch the browser during test - should see:
- Quick page transitions
- Smooth map rendering
- Instant tab switches
- No lag on search input

## Next: Integration with CI/CD

For GitHub Actions or other CI:

```yaml
- name: Run E2E Tests
  run: npm test -- --reporter=github
```

For Jenkins/GitLab:

```bash
npm test -- --reporter=junit --output-file=test-results.xml
```

## Files Reference

- **Tests**: `tests/map.spec.ts` (30+ test cases)
- **Config**: `playwright.config.ts` (auto-server, reporter setup)
- **README**: `tests/README.md` (detailed test documentation)
- **Summary**: `MAP_FEATURE_SUMMARY.md` (architecture & features)

---

**Total Time to Verify Feature Works**: ~2 minutes with `npm test`
