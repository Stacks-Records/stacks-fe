import GenreRow from './GenreRow'
import { withProviders } from '../testUtils/component-helpers'

const rockAlbums = [
    { id: 'a1', albumName: 'Wish You Were Here', artist: 'Pink Floyd', genre: 'Rock', imgURL: '' },
    { id: 'a2', albumName: 'Animals', artist: 'Pink Floyd', genre: 'Rock', imgURL: '' },
]

function mountGenreRow({ genre = 'Rock', addToStack = cy.stub().as('addToStack') } = {}) {
    cy.mount(
        withProviders(
            <div>
                <div style={{ height: 2000 }} data-cy="spacer" />
                <GenreRow genre={genre} authCode="test-token" addToStack={addToStack} />
            </div>,
            {
                myStack: { myStack: [] },
                authAlbum: { albums: rockAlbums, setAlbums: cy.stub(), authCode: 'test-token' },
                authorization: { checkAction: () => false },
            }
        )
    )
}

describe('GenreRow', () => {
    it('does not fetch until the row scrolls near the viewport', () => {
        cy.intercept('GET', '**/albums?genre=Rock', { body: rockAlbums }).as('getRock')
        mountGenreRow()
        cy.contains('h2', 'Rock')
        cy.wait(300)
        cy.get('@getRock.all').should('have.length', 0)
    })

    it('fetches and renders the carousel once visible', () => {
        cy.intercept('GET', '**/albums?genre=Rock', { body: rockAlbums }).as('getRock')
        mountGenreRow()
        cy.get('.genre-row').scrollIntoView()
        cy.wait('@getRock')
        cy.get('.album-cards').should('have.length', rockAlbums.length)
    })

    it('hides the row once loaded with zero albums', () => {
        cy.intercept('GET', '**/albums?genre=Pop', { body: [] }).as('getPop')
        mountGenreRow({ genre: 'Pop' })
        cy.get('.genre-row').scrollIntoView()
        cy.wait('@getPop')
        cy.get('.genre-row').should('not.exist')
    })

    it('shows an error message when the fetch fails', () => {
        cy.intercept('GET', '**/albums?genre=Rock', { statusCode: 500, body: {} }).as('getRock')
        mountGenreRow()
        cy.get('.genre-row').scrollIntoView()
        cy.wait('@getRock')
        cy.contains('.error-message', 'Could not load this genre.')
    })

    it('toggles sort order without refetching', () => {
        cy.intercept('GET', '**/albums?genre=Rock', { body: rockAlbums }).as('getRock')
        mountGenreRow()
        cy.get('.genre-row').scrollIntoView()
        cy.wait('@getRock')

        cy.get('.album-info h4').then($h4 => {
            const ascOrder = [...$h4].map(el => el.textContent)
            cy.get('.row-sort-toggle').click()
            cy.get('.album-info h4').then($h4Desc => {
                const descOrder = [...$h4Desc].map(el => el.textContent)
                expect(descOrder).to.deep.equal([...ascOrder].reverse())
            })
        })
        cy.get('@getRock.all').should('have.length', 1)
    })
})
