function loginViaAuth0Ui(username, password) {
  // App landing page redirects to Auth0.

  // Login on Auth0.
  cy.origin(
    Cypress.env('auth0_domain'),
    { args: { username, password } },
    ({ username, password }) => {
      cy.get('input#username').type(username)
      cy.get('input#password').type(password, { log: false })
      cy.contains('button[value=default]', 'Continue').click()
    }
  )

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should('equal', 'http://localhost:3000/landing')
}

Cypress.Commands.add('loginToAuth0', (username, password) => {
    const log = Cypress.log({
      displayName: 'AUTH0 LOGIN',
      message: [`🔐 Authenticating | ${username}`],
      // @ts-ignore
      autoEnd: false,
    })
    log.snapshot('before')
  
    cy.session(
    `auth0-session-${username}`, // Session key
    () => {
    cy.visit('http://localhost:3000/')
    cy.get('.auth_bttn').click()
      loginViaAuth0Ui(username, password)
      
      // Optionally log the localStorage to ensure token is saved
      cy.window().then((win) => {
        console.log('LocalStorage after login:', win.localStorage)
      })
    },
    {
      validate: () => {
        // Validate presence of access token in localStorage.
        cy.wrap(localStorage)
          .invoke('getItem', 'authAccessToken')
          .should('exist')
      },
    }
  )
  
    log.snapshot('after')
    log.end()
  })

function signupViaAuth0Ui(email, password) {
  // App landing page redirects to Auth0's Universal Login, which defaults to
  // the login tab — switch to signup before filling the form.
  cy.origin(
    Cypress.env('auth0_domain'),
    { args: { email, password } },
    ({ email, password }) => {
      cy.contains(/sign up/i).click()
      cy.get('input#email').type(email)
      cy.get('input#password').type(password, { log: false })
      cy.contains('button[value=default]', /sign up|continue/i).click()
    }
  )
}

// Drives real account creation on Auth0. Not wrapped in cy.session() like
// loginToAuth0 — each call uses a freshly generated email, so there is no
// prior session to restore.
Cypress.Commands.add('signupToAuth0', (email, password) => {
  const log = Cypress.log({
    displayName: 'AUTH0 SIGNUP',
    message: [`🆕 Signing up | ${email}`],
    autoEnd: false,
  })
  log.snapshot('before')

  cy.visit('http://localhost:3000/')
  cy.get('.auth_bttn').click()
  signupViaAuth0Ui(email, password)

  log.snapshot('after')
  log.end()
})