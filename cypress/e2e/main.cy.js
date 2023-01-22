import { password, email } from '../fixtures/credentials.json'

/* eslint-disable no-undef */
describe('Login and dashboard testing', () => {

  it('React app is running on login page', () => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:3001')
    cy.get('h2').should('contain', 'Inloggen')
  })
  it('Login with correct credentials', () => {
    login()
    cy.url().should('include', '/')
  })

  it('Display student view', () => {
    login()
    cy.get('h1').should('contain', 'Student view')
  })

  it('Searched "web" in searchbar and get web1, web2', () => {
    login()
    cy.get('#default-search').type('web')
    cy.get('[href="/stv/48d7a3ef-f16e-40f3-a42e-7c9d6a8b7c70"] > .relative > .text-2xl')
    cy.get('[href="/stv/cce6cb72-6e8f-42c2-b72a-b6d2f7b826b9"] > .relative > .text-2xl')
  })
})

// function to login
export const login = () => {
  cy.viewport(1920, 1080)
  cy.visit('http://localhost:3001')
  cy.get('input[name=email]').type(email)
  cy.get('input[name=password]').type(password)
  cy.get('button[type=submit]').click()
}
