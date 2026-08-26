const wishYouWereHere = {
  id: 'P-AL-33453-4L',
  albumName: 'Wish You Were Here',
  artist: 'Pink Floyd',
  releaseDate: 'September 12th, 1975',
  genre: 'Rock',
  bandMembers: ['Roger Waters', 'David Gilmour', 'Rick Wright', 'Nick Mason'],
  label: 'Harvest/Columbia',
  isBandTogether: false,
  rollingStoneReview: '*****',
  youTubeAlbumURL: 'https://www.youtube.com/watch?v=TMy_mYkwl4M',
  imgURL: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png',
  albumsSold: 130000000,
}

// Must match the decoded sub baked into cy.stubGoogleLogin (see googleAuthStub.js).
const OWN_SUB = 'google-oauth2|10822501943092869162'
const OTHER_SUB = 'google-oauth2|99999999999999999999'

describe('RecordPage — album detail', () => {
  beforeEach(() => {
    cy.interceptBackend()
  })

  it('displays the correct album information', () => {
    // App.js's data-load effect fetches the full albums.json fixture on every
    // route, so RecordPage finds this record in the cached list without
    // needing to route through the landing page's lazy-loaded genre rows.
    cy.stubGoogleLogin(`/${wishYouWereHere.id}`)
    cy.wait('@getAlbums')

    cy.get('.album-info h1').should('contain', 'Wish You Were Here')
    cy.get('.album-info h2').should('contain', 'Pink Floyd')
    cy.get('.album-info p').contains('Release Date:').parent().should('contain.text', 'September 12th, 1975')
    cy.get('.album-info p').contains('Genre:').parent().should('contain.text', 'Rock')
    cy.get('.album-info p').contains('Band Members:').parent().should('contain.text', 'Roger Waters')
    cy.get('.album-info p').contains('Label:').parent().should('contain.text', 'Harvest/Columbia')
    cy.get('.album-info p').contains('Band Status:').parent().should('contain.text', 'Disbanded')
    cy.get('.album-info p').contains('Rolling Stone Review:').parent().should('contain.text', '*****')
    cy.get('.album-info p').contains('Albums Sold:').parent().should('contain.text', '130,000,000')
  })

  it('shows the YouTube iframe when the album has a video URL', () => {
    cy.stubGoogleLogin(`/${wishYouWereHere.id}`)
    cy.wait('@getAlbums')

    cy.get('iframe').should('have.attr', 'src').and('include', 'youtube.com/embed')
  })

  it('does not show a YouTube iframe when the album has no video URL', () => {
    const noVideo = { ...wishYouWereHere, youTubeAlbumURL: '' }
    cy.intercept('GET', '**/albums', { body: [noVideo] }).as('getAlbums')
    cy.stubGoogleLogin(`/${noVideo.id}`)
    cy.wait('@getAlbums')

    cy.get('.album-info h1').should('contain', 'Wish You Were Here')
    cy.get('iframe').should('not.exist')
  })

  it('disables the Add To My Stack button once the album is already in the stack', () => {
    cy.intercept('GET', '**/api/v1/stacks', { body: [{ mystack: [wishYouWereHere] }] }).as('getStack')
    cy.stubGoogleLogin(`/${wishYouWereHere.id}`)
    cy.wait(['@getAlbums', '@getStack'])

    cy.get('.buttons-container').contains('button', 'Already Got It').should('be.disabled')
  })

  it('adds the album to My Stack and navigates to /my-stack', () => {
    cy.stubGoogleLogin(`/${wishYouWereHere.id}`)
    cy.wait('@getAlbums')

    cy.get('.buttons-container').contains('button', 'Add To My Stack').click()
    cy.url().should('include', '/my-stack')
  })

  it('shows "Record not found." for an unknown id', () => {
    cy.intercept('GET', '**/albums/*', { statusCode: 400, body: {} }).as('getRecordById')
    cy.stubGoogleLogin('/unknown-id-123')
    cy.wait('@getRecordById')

    cy.contains('Record not found.').should('exist')
  })
})

describe('RecordPage — permission-gated Edit/Delete buttons', () => {
  beforeEach(() => {
    cy.interceptBackend()
  })

  it('shows both Edit and Delete for an admin, regardless of ownership', () => {
    cy.stubGoogleLogin(`/${wishYouWereHere.id}`)
    cy.wait(['@getAlbums', '@getUserRole'])

    cy.get('.buttons-container').contains('button', 'Edit Album').should('exist')
    cy.get('.buttons-container').contains('button', 'Delete Album').should('exist')
  })

  it('shows Edit but not Delete for a plain user viewing their own record', () => {
    const owned = { ...wishYouWereHere, created_by: OWN_SUB }
    cy.intercept('GET', '**/api/v1/users/me', { body: { role: 'user' } }).as('getUserRole')
    cy.intercept('GET', '**/albums', { body: [owned] }).as('getAlbums')
    cy.stubGoogleLogin(`/${owned.id}`)
    cy.wait(['@getAlbums', '@getUserRole'])

    cy.get('.buttons-container').contains('button', 'Edit Album').should('exist')
    cy.get('.buttons-container').contains('button', 'Delete Album').should('not.exist')
  })

  it('hides both Edit and Delete for a plain user viewing someone else\'s record', () => {
    const notOwned = { ...wishYouWereHere, created_by: OTHER_SUB }
    cy.intercept('GET', '**/api/v1/users/me', { body: { role: 'user' } }).as('getUserRole')
    cy.intercept('GET', '**/albums', { body: [notOwned] }).as('getAlbums')
    cy.stubGoogleLogin(`/${notOwned.id}`)
    cy.wait(['@getAlbums', '@getUserRole'])

    cy.get('.buttons-container').contains('button', 'Edit Album').should('not.exist')
    cy.get('.buttons-container').contains('button', 'Delete Album').should('not.exist')
  })

  it('shows both Edit and Delete for a moderator, regardless of ownership', () => {
    const notOwned = { ...wishYouWereHere, created_by: OTHER_SUB }
    cy.intercept('GET', '**/api/v1/users/me', { body: { role: 'moderator' } }).as('getUserRole')
    cy.intercept('GET', '**/albums', { body: [notOwned] }).as('getAlbums')
    cy.stubGoogleLogin(`/${notOwned.id}`)
    cy.wait(['@getAlbums', '@getUserRole'])

    cy.get('.buttons-container').contains('button', 'Edit Album').should('exist')
    cy.get('.buttons-container').contains('button', 'Delete Album').should('exist')
  })
})
