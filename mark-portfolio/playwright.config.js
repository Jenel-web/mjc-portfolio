// Playwright setup for the portfolio.
// Tests run against the site on http://127.0.0.1:5500, the same address `npm run dev` uses.
// If it is not running, Playwright starts it for you.
const { defineConfig } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5500';

module.exports = defineConfig({
  testDir: './tests',
  outputDir: '../playwright-output/test-results',
  reporter: [['list'], ['html', { outputFolder: '../playwright-output/report', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx live-server --port=5500 --no-browser --quiet',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
