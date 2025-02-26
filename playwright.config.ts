// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },

  globalSetup: require.resolve("./tests/auth.setup.ts"),

  use: {
    baseURL: 'http://localhost:3000',
    storageState: "./playwright/.auth/storageState.json",
  },
});
