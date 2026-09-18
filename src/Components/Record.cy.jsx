import { Routes, Route } from 'react-router-dom'
import Album from './Record'
import { canPerformAction, USER_ROLES } from '../utils/permissions'
import { withProviders } from '../testUtils/component-helpers'

const album = {
    id: 'P-AL-33453-4L',
    albumName: 'Wish You Were Here',
    artist: 'Pink Floyd',
    genre: 'Rock',
    imgURL: 'https://example.com/cover.png',
    created_by: 'owner-sub',
}

const placeholderImg = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Part_of_Record_Collection_%285012173261%29.jpg'

function authorizationFor(userRole, userSub) {
    return {
        checkAction: (permission, ownerId) => canPerformAction(userRole, permission, ownerId, userSub),
    }
}

function mountAlbum({ myStack = [], authorization, addToStack = cy.stub().as('addToStack'), onAlbumDeleted = cy.stub().as('onAlbumDeleted'), setAlbums = cy.stub().as('setAlbums') } = {}) {
    cy.mount(
        withProviders(
            <Routes>
                <Route path="/" element={<Album album={album} addToStack={addToStack} onAlbumDeleted={onAlbumDeleted} />} />
                <Route path="/:id" element={<div data-cy="detail-marker">detail page</div>} />
            </Routes>,
            {
                myStack: { myStack },
                authAlbum: { albums: [album], setAlbums, authCode: 'test-token' },
                authorization: authorization ?? authorizationFor(USER_ROLES.USER, 'owner-sub'),
            }
        )
    )
}

describe('Record (Album card)', () => {
    it('renders the album fields and image', () => {
        mountAlbum()
        cy.contains('h3', album.artist)
        cy.contains('h4', album.albumName)
        cy.contains('p', album.genre)
        cy.get('img').should('have.attr', 'src', album.imgURL)
    })

    it('falls back to the placeholder image when the cover fails to load', () => {
        mountAlbum()
        cy.get('img').trigger('error')
        cy.get('img').should('have.attr', 'src', placeholderImg)
    })

    describe('add to stack', () => {
        it('is enabled and calls addToStack when the album is not already in the stack', () => {
            mountAlbum({ myStack: [] })
            cy.get('.album-cards').realHover()
            cy.contains('button', 'Add To My Stack').should('not.be.disabled').click()
            cy.get('@addToStack').should('have.been.calledWith', album)
        })

        it('is disabled and relabeled when the album is already in the stack', () => {
            mountAlbum({ myStack: [{ id: album.id }] })
            cy.contains('button', 'Already Got It').should('be.disabled')
        })
    })

    describe('edit/delete permission gating', () => {
        it('shows Edit and Delete for an admin', () => {
            mountAlbum({ authorization: authorizationFor(USER_ROLES.ADMIN, 'someone-else') })
            cy.contains('button', 'Edit').should('exist')
            cy.contains('button', 'Delete').should('exist')
        })

        it('shows Edit and Delete for a moderator', () => {
            mountAlbum({ authorization: authorizationFor(USER_ROLES.MODERATOR, 'someone-else') })
            cy.contains('button', 'Edit').should('exist')
            cy.contains('button', 'Delete').should('exist')
        })

        it('shows Edit but not Delete for a regular-user album owner', () => {
            mountAlbum({ authorization: authorizationFor(USER_ROLES.USER, album.created_by) })
            cy.contains('button', 'Edit').should('exist')
            cy.contains('button', 'Delete').should('not.exist')
        })

        it('hides Edit and Delete for a non-owner regular user', () => {
            mountAlbum({ authorization: authorizationFor(USER_ROLES.USER, 'someone-else') })
            cy.contains('button', 'Edit').should('not.exist')
            cy.contains('button', 'Delete').should('not.exist')
        })
    })

    describe('delete flow', () => {
        beforeEach(() => {
            cy.intercept('DELETE', '**/albums/*', { statusCode: 200, body: {} }).as('deleteAlbum')
        })

        it('deletes the album when the confirm dialog is accepted', () => {
            cy.on('window:confirm', () => true)
            mountAlbum({ authorization: authorizationFor(USER_ROLES.ADMIN, 'someone-else') })
            cy.get('.album-cards').realHover()
            cy.contains('button', 'Delete').click()
            cy.wait('@deleteAlbum')
            cy.get('@setAlbums').should('have.been.called')
            cy.get('@onAlbumDeleted').should('have.been.calledWith', album.id)
            cy.get('[data-cy=detail-marker]').should('not.exist')
        })

        it('does nothing when the confirm dialog is cancelled', () => {
            cy.on('window:confirm', () => false)
            mountAlbum({ authorization: authorizationFor(USER_ROLES.ADMIN, 'someone-else') })
            cy.get('.album-cards').realHover()
            cy.contains('button', 'Delete').click()
            cy.get('@setAlbums').should('not.have.been.called')
            cy.get('@onAlbumDeleted').should('not.have.been.called')
        })
    })

    describe('navigation', () => {
        it('navigates to the detail page when the card is clicked', () => {
            mountAlbum()
            cy.get('.album-cards').click()
            cy.get('[data-cy=detail-marker]').should('exist')
        })

        it('does not navigate when the Add To My Stack button is clicked', () => {
            mountAlbum()
            cy.get('.album-cards').realHover()
            cy.contains('button', 'Add To My Stack').click()
            cy.get('[data-cy=detail-marker]').should('not.exist')
        })
    })
})
