describe('Landing Page User Flow', () => {
  const api = 'https://stacks-api-6hnx.onrender.com/albums'
  const albumData = 'albums.json'

  beforeEach(() => {
    cy.intercept('GET', api, {fixture:albumData}).as('getAlbums')
    cy.visit('http://localhost:3000/')
    cy.wait('@getAlbums')
  })

  it('should display loading message', () => {
    cy.intercept('GET', api, {
      fixture:albumData, 
      delayMs:5000
    }).as('getDelayedAlbums')

    cy.visit('http://localhost:3000/')
    cy.get('.loading-message').should('contain', 'Loading up your records on the turntable...')
    cy.wait('@getDelayedAlbums')
  })

  it('should display albums on load', () => {
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

  it('should add an album to My Stack and navigate to My Stack Page', () => {
    cy.get('.album-list').contains('Wish You Were Here').parent().contains('Add To My Stack').click()
    cy.url().should('include', '/my-stack')
    cy.get('.my-stack-gallery').should('contain', 'Wish You Were Here')
  })
})