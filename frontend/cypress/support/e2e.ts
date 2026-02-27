// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Take screenshot after each test (both passing and failing)
afterEach(function (this: Mocha.Context) {
  const testTitle = Cypress.currentTest.title;
  const testState = this.currentTest?.state ?? "unknown";

  // Create a clean filename from the test title
  const cleanTitle = testTitle.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  const screenshotName = `${testState}_${cleanTitle}`;

  cy.screenshot(screenshotName, { capture: "viewport" });
});
