
const wishYouWereHere = {
  id: 'P-AL-33453-4L',
  albumName: 'Wish You Were Here',
  artist: 'Pink Floyd',
  genre: 'Rock',
  imgURL: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png',
}

const speakerboxxx = {
  id: '82876-50133-BB-SB-REI',
  albumName: 'Speakerboxxx/The Love Below',
  artist: 'Outkast',
  genre: 'Hip-Hop',
  imgURL: 'https://upload.wikimedia.org/wikipedia/en/5/54/Speakerboxxx-The_Love_Below.png',
}

const discovery = {
  id: '07243-849608',
  albumName: 'Discovery',
  artist: 'Daft Punk',
  genre: 'Pop',
  imgURL: 'https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png',
}


function interceptGenreRows() {
  cy.intercept('GET', '**/albums?genre=Rock', { body: [wishYouWereHere] }).as('getRock')
  cy.intercept('GET', '**/albums?genre=Hip-Hop', { body: [speakerboxxx] }).as('getHipHop')
  cy.intercept('GET', '**/albums?genre=Pop', { body: [discovery] }).as('getPop')
}

describe('LandingPage — default genre carousels', () => {
  beforeEach(() => {
    cy.viewport(1280, 2400)
    cy.interceptBackend()
    interceptGenreRows()
  })

  it('loads a row per canonical genre, sorted alphabetically (genreOrder: asc)', () => {
    cy.stubGoogleLogin('/landing')
    cy.wait(['@getGenres', '@getRock', '@getHipHop', '@getPop'])

    cy.get('.genre-heading').should('have.length', 3)
    cy.get('.genre-heading').then(($headings) => {
      const titles = [...$headings].map((el) => el.textContent)
      expect(titles).to.deep.equal(['Hip-Hop', 'Pop', 'Rock'])
    })
  })

  it('does not render a row for a genre with no albums', () => {
  cy.intercept('GET', '**/albums?genre=Pop', { body: [] }).as('getPop')
    cy.stubGoogleLogin('/landing')
    cy.wait(['@getGenres', '@getRock', '@getHipHop', '@getPop'])

    cy.contains('.genre-heading', 'Rock').should('exist')
    cy.contains('.genre-heading', 'Hip-Hop').should('exist')
    cy.contains('.genre-heading', 'Pop').should('not.exist')
  })

  it('adds an album to the stack from within a carousel row and navigates to /my-stack', () => {
    cy.intercept('PATCH', '**/api/v1/stacks', { body: {} }).as('addStack')
    cy.stubGoogleLogin('/landing')
    cy.wait(['@getGenres', '@getRock', '@getHipHop', '@getPop'])

    cy.contains('.album-cards', 'Wish You Were Here').find('.record-button').click()
    cy.wait('@addStack')
    cy.url().should('include', '/my-stack')
  })
})

describe('LandingPage — search', () => {
  beforeEach(() => {
    cy.interceptBackend()
    interceptGenreRows()
    cy.stubGoogleLogin('/landing')
    cy.wait('@getGenres')
  })

  it('shows matching results for a query', () => {
    cy.intercept('GET', '**/albums?search=*', { body: [discovery] }).as('search')

    cy.get('.search-container input[type="text"]').type('Daft Punk')
    cy.wait('@search')

    cy.get('.search-results-grid .album-cards').should('have.length', 1)
    cy.contains('.search-results-grid .album-cards', 'Discovery').should('exist')
  })

  it('shows a "no records match" message when the search has no hits', () => {
    cy.intercept('GET', '**/albums?search=*', { body: [] }).as('search')

    cy.get('.search-container input[type="text"]').type('Kill Em All')
    cy.wait('@search')

    cy.contains('No records match "Kill Em All".').should('exist')
  })

  it('shows an error message when the search request fails', () => {
    cy.intercept('GET', '**/albums?search=*', { statusCode: 500, body: {} }).as('search')

    cy.get('.search-container input[type="text"]').type('anything')
    cy.wait('@search')

    cy.contains('Could not search records.').should('exist')
  })

  it('clearing the search box returns to the default genre-row view', () => {
    cy.intercept('GET', '**/albums?search=*', { body: [discovery] }).as('search')

    cy.get('.search-container input[type="text"]').type('Daft Punk')
    cy.wait('@search')
    cy.get('.search-container input[type="text"]').clear()

    cy.get('.search-results-grid').should('not.exist')
    // .genre-rows toggles between display:none and display:contents, and
    // Cypress's visibility check doesn't reliably read display:contents as
    // visible, so assert on the css property directly instead.
    cy.get('.genre-rows').should('not.have.css', 'display', 'none')
  })
})

describe('LandingPage — genre filter and sort (browse view)', () => {
  beforeEach(() => {
    cy.interceptBackend()
    interceptGenreRows()
    cy.stubGoogleLogin('/landing')
    cy.wait('@getGenres')
  })

  it('filters to a single genre via the genre multi-select', () => {
    cy.get('#genre-filter-select').type('Rock{enter}')
    cy.wait('@getRock')

    cy.get('.browse-heading').should('contain', 'Rock')
    cy.get('.browse-view .album-cards').should('have.length', 1)
    cy.contains('.browse-view .album-cards', 'Wish You Were Here').should('exist')
  })

  it('shows a message when no records match the selected genre', () => {
    cy.intercept('GET', '**/albums?genre=Rock', { body: [] }).as('getRock')

    cy.get('#genre-filter-select').type('Rock{enter}')
    cy.wait('@getRock')

    cy.contains('No records match this selection.').should('exist')
  })

  it('sorts using the sort dropdown', () => {
    cy.intercept('GET', '**/albums?sortBy=albumsSold&order=desc', {
      body: [wishYouWereHere, discovery, speakerboxxx],
    }).as('getSorted')

    cy.get('.sort-select').select('Best selling')
    cy.wait('@getSorted')

    cy.get('.browse-heading').should('contain', 'Best selling')
    cy.get('.browse-view .album-cards').should('have.length', 3)
  })
})

describe('LandingPage — carousel vs grid view toggle', () => {
  beforeEach(() => {
    cy.interceptBackend()
    interceptGenreRows()
  })

  it('switches to grid view and fetches a flat, paginated list of albums', () => {
    cy.intercept('GET', '**/albums?page=1&limit=40', {
      body: [wishYouWereHere, speakerboxxx, discovery],
    }).as('getGrid')
    cy.intercept('PUT', '**/api/v1/users/me/preferences', { body: { preferences: {} } }).as('savePreferences')

    cy.stubGoogleLogin('/landing')
    cy.wait('@getGenres')

    cy.get('.view-mode-toggle').click()
    cy.wait('@getGrid')

    cy.get('.grid-view .album-cards').should('have.length', 3)
    cy.get('.genre-rows').should('not.be.visible')

    // View-mode choice is persisted server-side (debounced 500ms, flushed on
    // unmount), so it should survive a reload.
    cy.wait('@savePreferences').its('request.body').should('include', { viewMode: 'grid' })
  })
})
