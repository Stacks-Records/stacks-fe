describe('Auth0 — new account signup with email verification', () => {
  it('creates a real account, verifies via a real inbox, and reaches the landing page', () => {
    const alias = Cypress.env('gmail_test_email_base').replace('@', `+${Date.now()}@`)
    const password = Cypress.env('auth0_signup_password')
    const startedAt = Date.now()

    cy.signupToAuth0(alias, password)

    cy.task(
      'gmail:findVerificationLink',
      { toAlias: alias, sinceMs: startedAt },
      { timeout: 90000 }
    ).then((link) => cy.visit(link))

    cy.visit('http://localhost:3000')
    cy.get('.auth_bttn').click()
    cy.loginToAuth0(alias, password)

    cy.visit('http://localhost:3000/')

    cy.url().should('include', '/landing')
    cy.get('.landing-page').should('be.visible')
  })
})

describe('Auth0 — stubbed Google login', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/albums', { fixture: 'albums.json' }).as('getAlbums')
    cy.intercept('GET', '**/api/v1/stacks', { fixture: 'userStack.json' }).as('getStack')
    cy.intercept('POST', '**/api/v1/users', { fixture: 'user.json' }).as('postUser')
    cy.intercept('GET', '**/api/v1/users/me', { fixture: 'userRole.json' }).as('getUserRole')
    cy.intercept('GET', '**/api/v1/users/me/preferences', { fixture: 'preferences.json' }).as('getPreferences')
    cy.intercept('GET', '**/api/v1/genres', { fixture: 'genres.json' }).as('getGenres')
  })

  it('reports an authenticated Google-social user and reaches the landing page', () => {
    cy.stubGoogleLogin('/')

    cy.wait(['@getAlbums', '@getStack', '@getUserRole'])
    cy.url().should('include', '/landing')
    cy.contains('Rock')
  })
})
