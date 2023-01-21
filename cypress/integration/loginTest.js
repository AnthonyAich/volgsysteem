/* eslint-disable no-undef */
/// <reference types="cypress" />


describe("login test", () => {
    it("login page is shown", () => {
        cy.visit("http://localhost:3001");
        cy.get("h2").should('contain', 'Inloggen');
    });

    it("should login all users", () => {
        // login in input email and password

        // click submit button cy=submit_btn
        cy.get('[data-cy=submit_btn]').click();
    });

    it("should fail the login with wrong password", () => {
        cy.get('.notification').should('contain', 'Wachtwoord of gebruikersnaam is niet juist');
    });

    it("should fail the login with wrong username", () => {
        cy.get('.notification').should('contain', 'Wachtwoord of gebruikersnaam is niet juist');
    });
});
