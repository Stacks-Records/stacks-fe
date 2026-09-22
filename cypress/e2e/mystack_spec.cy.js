const wishYouWereHere = {
  id: 'P-AL-33453-4L',
  albumName: 'Wish You Were Here',
  artist: 'Pink Floyd',
  genre: 'Rock',
  imgURL: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png',
}

const discovery = {
  id: '07243-849608',
  albumName: 'Discovery',
  artist: 'Daft Punk',
  genre: 'Pop',
  imgURL: 'https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png',
}

// GET /api/v1/stacks now serves two shapes from the same URL: App.js's own
// unfiltered preload (no query params) still gets the legacy
// [{ mystack: [...] }] wrapper, while MyStackPage's grid always fetches
// through the filtered endpoint (always sends page/limit, and search/genre/
// sortBy/order when active), which gets a flat album array back. A request
// is routed to the filtered shape whenever it carries a `page` param.
// The trailing ** is required for the same reason as interceptBackend's
// default stub: a plain-string pattern must match the whole URL including
// the query string, or the paginated request falls through un-mocked.
function interceptStack(mystack) {
  cy.intercept('GET', '**/api/v1/stacks**', (req) => {
    if (req.query.page) {
      req.reply(mystack)
    } else {
      req.reply([{ mystack }])
    }
  }).as('getStack')
}

describe('MyStackPage', () => {
  beforeEach(() => {
    cy.interceptBackend()
  })

  it('shows the empty state and links back to landing when the stack is empty', () => {
    cy.stubGoogleLogin('/my-stack')
    cy.wait(['@getStack', '@getStack'])

    cy.contains('No records in your stack...').should('exist')
    cy.contains('button', 'Go Pick Some Out!').click()
    cy.url().should('include', '/landing')
  })

  it('shows every saved album and a link to add more', () => {
    interceptStack([wishYouWereHere, discovery])
    cy.stubGoogleLogin('/my-stack')
    cy.wait(['@getStack', '@getStack'])

    cy.get('.my-stack-card').should('have.length', 2)
    cy.contains('.my-stack-card', 'Wish You Were Here').should('exist')
    cy.contains('.my-stack-card', 'Discovery').should('exist')
    cy.contains('button', 'Go Pick Out Some More!').should('exist')
  })

  it('removes one album and keeps the remaining album displayed', () => {
    interceptStack([wishYouWereHere, discovery])
    cy.intercept('PATCH', '**/api/v1/stacks/delete', { body: { user: { mystack: [discovery] } } }).as('deleteStack')
    cy.stubGoogleLogin('/my-stack')
    cy.wait(['@getStack', '@getStack'])


    cy.contains('.my-stack-card', 'Wish You Were Here').realHover()
    cy.contains('.my-stack-card', 'Wish You Were Here').find('.delete-button').click()
    cy.wait('@deleteStack')

    cy.get('.my-stack-card').should('have.length', 1)
    cy.contains('.my-stack-card', 'Discovery').should('exist')
    cy.contains('.my-stack-card', 'Wish You Were Here').should('not.exist')

    cy.get('.my-stack-title').realHover()
  })

  it('transitions to the empty state after removing the last album', () => {
    interceptStack([wishYouWereHere])
    cy.intercept('PATCH', '**/api/v1/stacks/delete', { body: { user: { mystack: [] } } }).as('deleteStack')
    cy.stubGoogleLogin('/my-stack')
    cy.wait(['@getStack', '@getStack'])
    cy.get('.my-stack-card').realHover()
    cy.get('.delete-button').click()
    cy.wait('@deleteStack')

    cy.get('.my-stack-card').should('not.exist')
    cy.contains('No records in your stack...').should('exist')

    cy.get('.my-stack-title').realHover()
  })

  it('navigates to the record detail page when a card is clicked', () => {
    interceptStack([wishYouWereHere])
    cy.stubGoogleLogin('/my-stack')
    cy.wait(['@getStack', '@getStack'])

    cy.contains('.my-stack-card', 'Wish You Were Here').click()
    cy.url().should('include', `/${wishYouWereHere.id}`)
  })
})

describe('MyStackPage — search/sort/filter', () => {
  beforeEach(() => {
    cy.interceptBackend()
    interceptStack([wishYouWereHere, discovery])
    cy.stubGoogleLogin('/my-stack')
    cy.wait(['@getStack', '@getStack'])
  })

  it('filters the stack by search text', () => {
    cy.intercept('GET', '**/api/v1/stacks?search=*', { body: [discovery] }).as('search')

    cy.get('.search-container input[type="text"]').type('Daft Punk')
    cy.wait('@search')

    cy.get('.my-stack-card').should('have.length', 1)
    cy.contains('.my-stack-card', 'Discovery').should('exist')
  })

  it('shows a "no records match" message when the search has no hits', () => {
    cy.intercept('GET', '**/api/v1/stacks?search=*', { body: [] }).as('search')

    cy.get('.search-container input[type="text"]').type('Kill Em All')
    cy.wait('@search')

    cy.contains('No records match this search/filter.').should('exist')
  })

  it('filters the stack by genre via the genre multi-select', () => {
    cy.wait('@getGenres')
    cy.intercept('GET', '**/api/v1/stacks?genre=Rock*', { body: [wishYouWereHere] }).as('getRock')

    cy.get('#genre-filter-select').type('Rock{enter}')
    cy.wait('@getRock')

    cy.get('.my-stack-card').should('have.length', 1)
    cy.contains('.my-stack-card', 'Wish You Were Here').should('exist')
  })

  it('does not render the genre-order or view-mode toggles', () => {
    cy.get('.genre-order-toggle').should('not.exist')
    cy.get('.view-mode-toggle').should('not.exist')
  })
})
