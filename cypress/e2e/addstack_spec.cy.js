const newAlbum = {
  albumName: 'Test Album',
  artist: 'Test Artist',
  releaseDate: '2024-01-01',
  label: 'Test Label',
  rollingStoneReview: '****',
  youTubeAlbumURL: 'https://youtu.be/AAAAAAAAAAA',
  imgURL: 'https://example.test/cover.png',
  albumsSold: '1000000',
  bandMembers: 'Member One',
}

function fillOutForm() {
  cy.get('input[name="albumName"]').type(newAlbum.albumName)
  cy.get('input[name="artist"]').type(newAlbum.artist)
  cy.get('input[name="releaseDate"]').type(newAlbum.releaseDate)
  cy.get('#genre-select').type('Rock{enter}')
  cy.get('input[name="label"]').type(newAlbum.label)
  cy.get('input[name="rollingStoneReview"]').type(newAlbum.rollingStoneReview)
  cy.get('input[name="youTubeAlbumURL"]').type(newAlbum.youTubeAlbumURL)
  cy.get('input[name="imgURL"]').type(newAlbum.imgURL)
  cy.get('input[name="albumsSold"]').type(newAlbum.albumsSold)
  cy.get('input[name="bandMembers"]').type(newAlbum.bandMembers)
  cy.get('input[name="isBandTogether"]').check()
}

describe('Add Stack — post a new album', () => {
  beforeEach(() => {
    cy.interceptBackend()
    cy.intercept('GET', newAlbum.imgURL, { fixture: 'test-cover.png' }).as('getCoverImage')

    cy.stubGoogleLogin('/add-stack')
    cy.wait('@getGenres')
  })

  it('fills out and submits the form successfully', () => {
    cy.intercept('POST', '**/add-stack', { statusCode: 201, body: newAlbum }).as('postAlbum')

    fillOutForm()
    cy.get('button[type="submit"]').click()

    cy.wait('@postAlbum').its('request.body').should('include', {
      albumName: newAlbum.albumName,
      artist: newAlbum.artist,
    })
    cy.url().should('include', '/landing')
  })

  it('shows an error message on submission failure', () => {
    cy.intercept('POST', '**/add-stack', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('postAlbumError')

    fillOutForm()
    cy.get('button[type="submit"]').click()

    cy.wait('@postAlbumError')
    cy.get('.error').should('contain', 'Failed to add album. Please try again.')
    cy.url().should('include', '/add-stack')
  })

  it('blocks submission when required fields are empty', () => {
    cy.get('button[type="submit"]').click()
    cy.get('input[required]:first')
      .invoke('prop', 'validationMessage')
      .should('contain', 'Please fill out this field')
  })
})
