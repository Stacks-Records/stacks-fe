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

describe('MyStackPage', () => {
  beforeEach(() => {
    cy.interceptBackend()
  })

  it('shows the empty state and links back to landing when the stack is empty', () => {
    cy.stubGoogleLogin('/my-stack')
    cy.wait('@getStack')

    cy.contains('No records in your stack...').should('exist')
    cy.contains('button', 'Go Pick Some Out!').click()
    cy.url().should('include', '/landing')
  })

  it('shows every saved album and a link to add more', () => {
    cy.intercept('GET', '**/api/v1/stacks', { body: [{ mystack: [wishYouWereHere, discovery] }] }).as('getStack')
    cy.stubGoogleLogin('/my-stack')
    cy.wait('@getStack')

    cy.get('.my-stack-card').should('have.length', 2)
    cy.contains('.my-stack-card', 'Wish You Were Here').should('exist')
    cy.contains('.my-stack-card', 'Discovery').should('exist')
    cy.contains('button', 'Go Pick Out Some More!').should('exist')
  })

  it('removes one album and keeps the remaining album displayed', () => {
    cy.intercept('GET', '**/api/v1/stacks', { body: [{ mystack: [wishYouWereHere, discovery] }] }).as('getStack')
    cy.intercept('PATCH', '**/api/v1/stacks/delete', { body: { user: { mystack: [discovery] } } }).as('deleteStack')
    cy.stubGoogleLogin('/my-stack')
    cy.wait('@getStack')


    cy.contains('.my-stack-card', 'Wish You Were Here').realHover()
    cy.contains('.my-stack-card', 'Wish You Were Here').find('.delete-button').click()
    cy.wait('@deleteStack')

    cy.get('.my-stack-card').should('have.length', 1)
    cy.contains('.my-stack-card', 'Discovery').should('exist')
    cy.contains('.my-stack-card', 'Wish You Were Here').should('not.exist')

    cy.get('.my-stack-title').realHover()
  })

  it('transitions to the empty state after removing the last album', () => {
    cy.intercept('GET', '**/api/v1/stacks', { body: [{ mystack: [wishYouWereHere] }] }).as('getStack')
    cy.intercept('PATCH', '**/api/v1/stacks/delete', { body: { user: { mystack: [] } } }).as('deleteStack')
    cy.stubGoogleLogin('/my-stack')
    cy.wait('@getStack')
    cy.get('.my-stack-card').realHover()
    cy.get('.delete-button').click()
    cy.wait('@deleteStack')

    cy.get('.my-stack-card').should('not.exist')
    cy.contains('No records in your stack...').should('exist')

    cy.get('.my-stack-title').realHover()
  })

  it('navigates to the record detail page when a card is clicked', () => {
    cy.intercept('GET', '**/api/v1/stacks', { body: [{ mystack: [wishYouWereHere] }] }).as('getStack')
    cy.stubGoogleLogin('/my-stack')
    cy.wait('@getStack')

    cy.contains('.my-stack-card', 'Wish You Were Here').click()
    cy.url().should('include', `/${wishYouWereHere.id}`)
  })
})
