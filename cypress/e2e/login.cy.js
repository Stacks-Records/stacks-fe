describe('Auth0', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000/')
    cy.get('.auth_bttn').click()
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
  })

  it('shows onboarding', function () {
    // cy.get('.auth_bttn').click()

    // cy.contains('Get Started').should('be.visible')
  })
})