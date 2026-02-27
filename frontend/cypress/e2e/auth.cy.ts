describe("Authentication", () => {
  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Login Page", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should display login form correctly", () => {
      cy.contains("Welcome back").should("be.visible");
      cy.contains("Sign in to continue reflecting").should("be.visible");
      cy.get('input[name="email"]').should("be.visible");
      cy.get('input[name="password"]').should("be.visible");
      cy.contains("Sign In").should("be.visible");
      cy.contains("Google").should("be.visible");
      cy.contains("GitHub").should("be.visible");
    });

    it("should show email validation error for invalid email", () => {
      cy.get('input[name="email"]').type("invalid-email");
      cy.contains(
        "Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed."
      ).should("be.visible");
    });

    it("should navigate to register page", () => {
      cy.contains("Sign up").click();
      cy.url().should("include", "/register");
    });

    it("should navigate to home as guest", () => {
      cy.contains("Continue as guest").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Register Page", () => {
    beforeEach(() => {
      cy.visit("/register");
    });

    it("should display register form correctly", () => {
      cy.contains("Create account").should("be.visible");
      cy.contains("Begin your reflection journey").should("be.visible");
      cy.get('input[name="name"]').should("be.visible");
      cy.get('input[name="email"]').should("be.visible");
      cy.get('input[name="password"]').should("be.visible");
      cy.contains("Create Account").should("be.visible");
    });
  });
});
