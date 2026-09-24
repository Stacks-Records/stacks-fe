import { Routes, Route } from 'react-router-dom'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import MyStackAlbum from './MyStackAlbum'
import { withProviders } from '../testUtils/component-helpers'

const album = {
    id: 'P-AL-33453-4L',
    albumName: 'Wish You Were Here',
    artist: 'Pink Floyd',
    genre: 'Rock',
    imgURL: 'https://example.com/cover.png',
}

// Mirrors MyStackPage's own sensor config (8px activation distance) so the
// click/drag-conflict tests below reflect real behavior - a bare DndContext
// with no sensors configured activates a drag on any pointer movement.
function DndHarness({ children }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )
    return <DndContext sensors={sensors}>{children}</DndContext>
}

// MyStackAlbum calls useSortable, which throws outside a SortableContext
// ancestor - every mount needs this wrapper, matching how MyStackPage wraps
// the real grid.
function mountCard({ handleDelete = cy.stub().as('handleDelete'), dragDisabled = false } = {}) {
    cy.mount(
        withProviders(
            <Routes>
                <Route path="/" element={
                    <DndHarness>
                        <SortableContext items={[album.id]}>
                            <MyStackAlbum album={album} handleDelete={handleDelete} dragDisabled={dragDisabled} />
                        </SortableContext>
                    </DndHarness>
                } />
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

    it('omits drag listeners/attributes when dragDisabled is true', () => {
        mountCard({ dragDisabled: true })
        cy.get('.my-stack-card').should('not.have.attr', 'aria-roledescription')
    })

    it('exposes drag attributes when dragging is enabled', () => {
        mountCard()
        cy.get('.my-stack-card').should('have.attr', 'aria-roledescription', 'sortable')
    })

    it('still navigates on a plain click (pointer movement under the drag activation distance)', () => {
        mountCard()
        cy.get('.my-stack-card')
            .realMouseDown()
            .realMouseMove(2, 2)
            .realMouseUp()
        cy.get('[data-cy=detail-marker]').should('exist')
    })

    it('does not navigate when the pointer moves past the drag activation distance', () => {
        mountCard()
        cy.get('.my-stack-card')
            .realMouseDown()
            .realMouseMove(40, 40)
            .realMouseUp()
        cy.get('[data-cy=detail-marker]').should('not.exist')
    })
})
