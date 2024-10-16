describe('Landing Page User Flow', () => {
  const api = 'http://localhost:3001/albums'
  const albumData = 'albums.json'
  const userStack = 'userStack.json'
  const user = 'user.json'
  const token = 'token.json'
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.get('.auth_bttn').click()
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
    cy.intercept('GET', api, {fixture:albumData}).as('getAlbums')
    cy.intercept('GET', 'http://localhost:3001/api/v1/stacks',{fixture:userStack}).as('userStack')
    cy.intercept('POST', 'http://localhost:3001/api/v1/users',{fixture:user}).as('user')
    // cy.intercept('POST','https://dev-gniv73lrty2i6mv2.us.auth0.com/oauth/token',{fixture:token}).as('token')
    cy.visit('http://localhost:3000/')
    cy.wait('@getAlbums')
  })

  it.only('should display albums on load', () => {

    cy.get('.album-list').children().should('have.length', 3)
    cy.get('.album-list').contains('Wish You Were Here')
    cy.get('.album-list').contains('Speakerboxxx/The Love Below')
    cy.get('.album-list').contains('Discovery') 
  })

  it('should filter albums by genre', () => {
    cy.get('select').select('Rock')
    cy.get('.album-list').children().should('have.length', 1)
    cy.get('.album-list').contains('Wish You Were Here')
  })

  it('should filter albums by search', () => {
    cy.get('input[type="text"]').type('Daft Punk')
    cy.get('.search-results').contains('Daft Punk').click()
    cy.get('.album-list').contains('Discovery')
  })

  it('should handle empty search and genre filters', () => {
    cy.get('input[type="text"]').type('Kill Em All')
    cy.get('.album-list').children().should('have.length', 0)
    cy.get('select').select('Country')
    cy.get('.album-list').children().should('have.length', 0)
  })

})