// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// App.js's own data-load effect runs on every route regardless of which page
// is under test, so any spec that stubs authentication needs this same base
// set of intercepts or it'll hit the real (likely unrunning) backend.
Cypress.Commands.add('interceptBackend', () => {
  cy.intercept('GET', '**/albums', { fixture: 'albums.json' }).as('getAlbums')
  cy.intercept('GET', '**/api/v1/stacks', { fixture: 'userStack.json' }).as('getStack')
  cy.intercept('POST', '**/api/v1/users', { fixture: 'user.json' }).as('postUser')
  cy.intercept('GET', '**/api/v1/users/me', { fixture: 'userRole.json' }).as('getUserRole')
  cy.intercept('GET', '**/api/v1/users/me/preferences', { fixture: 'preferences.json' }).as('getPreferences')
  cy.intercept('GET', '**/api/v1/genres', { fixture: 'genres.json' }).as('getGenres')
})