describe('Header — unauthenticated', () => {
  it('shows the logo but no hamburger menu when logged out', () => {
    cy.interceptBackend()
    cy.visit('/landing')

    cy.get('.header-link').should('have.attr', 'href', '/landing')
    cy.get('.header-link').contains('h1', 'STACKS')
    cy.get('#hamburger-button').should('not.exist')
  })
})

describe('Header — authenticated', () => {
  beforeEach(() => {
    cy.interceptBackend()
    // interceptBackend's default userRole.json fixture is { role: "admin" }.
    cy.stubGoogleLogin('/landing')
    cy.wait('@getAlbums')
  })

  it('toggles the dropdown open and closed', () => {
    cy.get('.dropdown').should('not.exist')
    cy.get('#hamburger-button').click()
    cy.get('.dropdown').should('exist')
    cy.get('#hamburger-button').click()
    cy.get('.dropdown').should('not.exist')
  })

  it('shows My Stack, Add to Stacks, and (for an admin) Admin: Users links', () => {
    cy.get('#hamburger-button').click()
    cy.get('.dropdown-list').within(() => {
      cy.contains('a', 'My Stack').should('have.attr', 'href', '/my-stack')
      cy.contains('a', 'Add to Stacks').should('have.attr', 'href', '/add-stack')
      cy.contains('a', 'Admin: Users').should('have.attr', 'href', '/admin/users')
    })
  })

  it('hides the Admin: Users link for a non-admin role', () => {
    cy.intercept('GET', '**/api/v1/users/me', { body: { role: 'user' } }).as('getUserRole')
    cy.visit('/landing')
    cy.wait('@getUserRole')

    cy.get('#hamburger-button').click()
    cy.get('.dropdown-list').should('not.contain', 'Admin: Users')
  })

  it('navigates to My Stack and closes the dropdown', () => {
    cy.get('#hamburger-button').click()
    cy.contains('.dropdown-list a', 'My Stack').click()

    cy.url().should('include', '/my-stack')
    cy.get('.dropdown').should('not.exist')
  })

  it('navigates to Add to Stacks and closes the dropdown', () => {
    cy.get('#hamburger-button').click()
    cy.contains('.dropdown-list a', 'Add to Stacks').click()

    cy.url().should('include', '/add-stack')
    cy.get('.dropdown').should('not.exist')
  })
})

describe('Footer', () => {
  beforeEach(() => {
    cy.interceptBackend()
    cy.visit('/landing')
  })

  it('credits every team member with working GitHub and LinkedIn links', () => {
    const credits = [
      { name: 'Kyle Boomer', github: 'https://www.github.com/kylemboomer', linkedin: 'https://www.linkedin.com/in/kylemboomer' },
      { name: 'Peter Kim', github: 'https://www.github.com/peterkimpk1', linkedin: 'https://www.linkedin.com/in/pk-2403fee' },
      { name: 'Adam Konber', github: 'https://www.github.com/Sterling47', linkedin: 'https://www.linkedin.com/in/adam-konber' },
    ]

    cy.get('.footer .created-by').should('contain', 'Created by:')
    cy.get('.footer .person').should('have.length', credits.length)

    credits.forEach((person, i) => {
      cy.get('.footer .person').eq(i).within(() => {
        cy.get('.name').should('contain', person.name)
        cy.get('.github-link').should('have.attr', 'href', person.github)
        cy.get('.github').should('have.attr', 'alt', 'Github Logo')
        cy.get('.linkedin-link').should('have.attr', 'href', person.linkedin)
        cy.get('.linkedin').should('have.attr', 'alt', 'LinkedIn Logo')
      })
    })
  })
})
