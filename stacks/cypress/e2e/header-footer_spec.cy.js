describe('Header and Footer', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should display the Header component correctly', () => {
    cy.get('.header-link').should('have.attr', 'href', '/')
    cy.get('.header-link').contains('h1', 'Stacks')
    cy.get('.nav-list').within(() => {
      cy.get('.nav-item').eq(0).contains('a', 'My Stack').should('have.attr', 'href', '/my-stack')
      cy.get('.nav-item').eq(1).contains('a', 'Add to Stacks').should('have.attr', 'href', '/add-stack')
    })

    cy.get('#hamburger-button').click()
    cy.get('.nav').should('have.class', 'open')
    cy.get('#hamburger-button').click()
    cy.get('.nav').should('not.have.class', 'open')
  })

  it('should display the Footer component correctly', () => {
    cy.get('.footer').within(() => {
      cy.get('.created-by').should('contain', 'Created by:')
      cy.get('.person').within(() => {
        cy.get('.name').should('contain', 'Kyle Boomer')
        cy.get('.github').should('have.attr', 'alt', 'Github Logo')
        cy.get('.github-link').should('have.attr', 'href', 'https://www.github.com/kylemboomer').should('contain', '@Github')
        cy.get('.linkedin').should('have.attr', 'alt', 'LinkedIn Logo')
        cy.get('.linkedin-link').should('have.attr', 'href', 'https://www.linkedin.com/in/kylemboomer').should('contain', '@LinkedIn')
      })
    })
  })

    it('should navigate to My Stack page when My Stack link is clicked', () => {
      cy.get('.nav-item a[href="/my-stack"]').click()
      cy.url().should('include', '/my-stack')
    })

    it('should navigate to Add to Stacks page when Add to Stacks is clicked', () => {
      cy.get('.nav-item a[href="/add-stack"]').click()
      cy.url().should('include', '/add-stack')
    })

})