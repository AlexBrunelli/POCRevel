import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/allure',
  reporter: [
    ['line'],
    ['allure-playwright']
  ],
  use: {
    baseURL: 'https://driverevel.com/es/es',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});