import { Routes, Route } from 'react-router-dom'
import MyStackAlbum from './MyStackAlbum'
import { withProviders } from '../testUtils/component-helpers'

const album = {
    id: 'P-AL-33453-4L',
    albumName: 'Wish You Were Here',
    artist: 'Pink Floyd',
    genre: 'Rock',
    imgURL: 'https://example.com/cover.png',
}

function mountCard({ handleDelete = cy.stub().as('handleDelete') } = {}) {
    cy.mount(
        withProviders(
            <Routes>
                <Route path="/" element={<MyStackAlbum album={album} handleDelete={handleDelete} />} />
                <Route path="/:id" element={<div data-cy="detail-marker">detail page</div>} />
            </Routes>
        )
    )
}

describe('MyStackAlbum', () => {
    it('renders the album fields', () => {
        mountCard()
        cy.contains('h3', album.artist)
        cy.contains('h4', album.albumName)
        cy.contains('p', album.genre)
    })

    it('navigates to the detail page when the card is clicked', () => {
        mountCard()
        cy.get('.my-stack-card').click()
        cy.get('[data-cy=detail-marker]').should('exist')
    })

    it('calls handleDelete with the album and does not navigate when Toss This Record is clicked', () => {
        mountCard()
        cy.get('.my-stack-card').realHover()
        cy.contains('button', 'Toss This Record').click()
        cy.get('@handleDelete').should('have.been.calledWith', album)
        cy.get('[data-cy=detail-marker]').should('not.exist')
    })
})
