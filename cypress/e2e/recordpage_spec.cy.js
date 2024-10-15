describe('RecordPage Component Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('.auth_bttn').click()
        cy.loginToAuth0(
            Cypress.env('auth0_username'),
            Cypress.env('auth0_password')
        )
        cy.intercept('GET', '**/albums', { fixture: 'recordpage.json' }).as('getRecords')
        cy.visit('http://localhost:3000/')
        cy.wait('@getRecords')
    })

    it('should display the correct album information', () => {
        cy.contains('Currents').click()
        cy.url().should('include', '/602547306777')

        cy.get('.album-info h1').should('contain', 'Currents')
        cy.get('.album-info h2').should('contain', 'Tame Impala')

        cy.get('.album-info p').contains('Release Date:').parent().should('contain.text', 'July 17th, 2015')
        cy.get('.album-info p').contains('Genre:').parent().should('contain.text', 'Rock')
        cy.get('.album-info p').contains('Band Members:').parent().should('contain.text', 'Kevin Parker')
        cy.get('.album-info p').contains('Label:').parent().should('contain.text', 'Modular')
        cy.get('.album-info p').contains('Band Status:').parent().should('contain.text', 'Together')
        cy.get('.album-info p').contains('Rolling Stone Review:').parent().should('contain.text', '****')
        cy.get('.album-info p').contains('Albums Sold:').parent().should('contain.text', '1,325,034')
    })

    it('should add the album to My Stack and disable the Add button', () => {
        cy.contains('Currents').click()
        cy.url().should('include', '/602547306777')
        cy.get('.buttons-container').should('exist')

        cy.get('.buttons-container').contains('Add To My Stack').should('not.be.disabled')
        cy.get('.buttons-container').contains('Add To My Stack').click()
        cy.url().should('include', '/my-stack')
    })

    it('should display an error message when the record is not found', () => {
        cy.visit('http://localhost:3000/unknown-id')
        cy.contains('Record not found.').should('exist')
    })

    it('should display album info on hover', () => {
        cy.contains('Currents').click()
        cy.url().should('include', '/602547306777')

        cy.get('.image-container').trigger('mouseover')
        cy.get('.album-info').should('have.css', 'opacity', '0')
        cy.get('.album-info').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 20)')
    })

    it('should display YouTube iframe if album has YouTube URL', () => {
        cy.contains('Currents').click()
        cy.url().should('include', '/602547306777')

        cy.get('iframe').should('exist')
        cy.get('iframe').should('have.attr', 'src').and('include', 'youtube.com/embed')
    })

})
