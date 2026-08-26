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

  it('shows a field error and blocks submission when no genre is selected', () => {
    cy.get('input[name="albumName"]').type(newAlbum.albumName)
    cy.get('input[name="artist"]').type(newAlbum.artist)
    cy.get('input[name="releaseDate"]').type(newAlbum.releaseDate)
    cy.get('input[name="label"]').type(newAlbum.label)
    cy.get('input[name="rollingStoneReview"]').type(newAlbum.rollingStoneReview)
    cy.get('input[name="youTubeAlbumURL"]').type(newAlbum.youTubeAlbumURL)
    cy.get('input[name="imgURL"]').type(newAlbum.imgURL)
    cy.get('input[name="albumsSold"]').type(newAlbum.albumsSold)

    cy.get('button[type="submit"]').click()

    cy.get('.field-error').should('contain', 'Select at least one genre.')
    cy.url().should('include', '/add-stack')
  })

  it('shows a field error when the YouTube URL is not a valid YouTube link', () => {
    fillOutForm()
    cy.get('input[name="youTubeAlbumURL"]').clear()
    cy.get('input[name="youTubeAlbumURL"]').type('https://vimeo.com/12345')

    cy.get('button[type="submit"]').click()

    cy.get('.field-error').should('contain', 'Enter a valid YouTube link')
    cy.url().should('include', '/add-stack')
  })

  it('shows a field error when the image URL cannot be loaded', () => {
    fillOutForm()
    cy.intercept('GET', newAlbum.imgURL, { statusCode: 404 }).as('getBrokenCoverImage')

    cy.get('button[type="submit"]').click()

    cy.get('.field-error').should('contain', 'That image link could not be loaded.')
    cy.url().should('include', '/add-stack')
  })
})

describe('Add Stack — edit an existing album', () => {
  const wishYouWereHere = {
    id: 'P-AL-33453-4L',
    albumName: 'Wish You Were Here',
    artist: 'Pink Floyd',
    releaseDate: 'September 12th, 1975',
    genre: 'Rock',
    label: 'Harvest/Columbia',
    isBandTogether: false,
    rollingStoneReview: '*****',
    youTubeAlbumURL: 'https://www.youtube.com/watch?v=TMy_mYkwl4M',
    imgURL: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png',
    albumsSold: 130000000,
  }

  beforeEach(() => {
    cy.interceptBackend()
    cy.intercept('GET', wishYouWereHere.imgURL, { fixture: 'test-cover.png' }).as('getCoverImage')

    // App.js's data-load effect fetches the full albums.json fixture on every
    // route, so RecordPage finds this record in the cached list — no need to
    // route through the landing page's lazy-loaded genre rows to reach it.
    // interceptBackend's default userRole.json fixture is { role: "admin" },
    // which is always allowed to edit — reaching the form this way (instead of
    // visiting /add-stack directly) is what actually sets location.state.
    cy.stubGoogleLogin(`/${wishYouWereHere.id}`)
    cy.wait('@getAlbums')
    cy.contains('button', 'Edit Album').click()
    cy.url().should('include', '/add-stack')
  })

  it('pre-fills the form with the existing album data', () => {
    cy.get('h1').should('contain', 'Edit Album')
    cy.get('input[name="albumName"]').should('have.value', wishYouWereHere.albumName)
    cy.get('input[name="artist"]').should('have.value', wishYouWereHere.artist)
    cy.get('input[name="releaseDate"]').should('have.value', '1975-09-12')
    cy.get('input[name="label"]').should('have.value', wishYouWereHere.label)
    cy.get('input[name="rollingStoneReview"]').should('have.value', wishYouWereHere.rollingStoneReview)
    cy.get('input[name="youTubeAlbumURL"]').should('have.value', wishYouWereHere.youTubeAlbumURL)
    cy.get('input[name="imgURL"]').should('have.value', wishYouWereHere.imgURL)
    cy.get('input[name="albumsSold"]').should('have.value', String(wishYouWereHere.albumsSold))
    cy.get('input[name="isBandTogether"]').should('not.be.checked')
    cy.get('.genre-select__multi-value__label').should('contain', 'Rock')
    cy.get('button[type="submit"]').should('contain', 'Save Changes')
  })

  it('submits changes and navigates to the record detail page (not /landing)', () => {
    cy.intercept('PATCH', `**/albums/${wishYouWereHere.id}`, {
      statusCode: 200,
      body: { ...wishYouWereHere, albumsSold: 999 },
    }).as('editAlbum')

    cy.get('input[name="albumsSold"]').clear()
    cy.get('input[name="albumsSold"]').type('999')
    cy.get('button[type="submit"]').click()

    cy.wait('@editAlbum').its('request.body').should('include', { albumsSold: 999 })
    cy.url().should('include', `/${wishYouWereHere.id}`)
    cy.url().should('not.include', '/add-stack')
  })

  it('shows an error message on edit failure and stays on the form', () => {
    cy.intercept('PATCH', `**/albums/${wishYouWereHere.id}`, {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('editAlbumError')

    cy.get('button[type="submit"]').click()

    cy.wait('@editAlbumError')
    cy.get('.error').should('contain', 'Failed to update album. Please try again.')
    cy.url().should('include', '/add-stack')
  })
})
