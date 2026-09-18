import AlbumCarousel from './AlbumCarousel'
import { withProviders } from '../testUtils/component-helpers'

const albums = [
    { id: 'a1', albumName: 'Wish You Were Here', artist: 'Pink Floyd', genre: 'Rock', imgURL: '' },
    { id: 'a2', albumName: 'Discovery', artist: 'Daft Punk', genre: 'Pop', imgURL: '' },
]

describe('AlbumCarousel', () => {
    it('renders one card per album and forwards addToStack', () => {
        const addToStack = cy.stub().as('addToStack')
        cy.mount(
            withProviders(
                <AlbumCarousel albums={albums} addToStack={addToStack} onAlbumDeleted={cy.stub()} />,
                {
                    myStack: { myStack: [] },
                    authAlbum: { albums, setAlbums: cy.stub(), authCode: 'test-token' },
                    authorization: { checkAction: () => false },
                }
            )
        )
        cy.get('.album-cards').should('have.length', albums.length)
        cy.contains('.album-cards', 'Wish You Were Here').contains('button', 'Add To My Stack').click()
        cy.get('@addToStack').should('have.been.calledWith', albums[0])
    })
})
