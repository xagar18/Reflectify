import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:5173", // Vite dev server default
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false, // Disable failure-only screenshots
    screenshotsFolder: "cypress/screenshots/all-tests", // Custom folder for all screenshots
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
  },
});
