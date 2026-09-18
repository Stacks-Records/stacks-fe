import Profile from './Profile'
import { withProviders, mockAuth0 } from '../testUtils/component-helpers'

describe('Profile', () => {
    it('shows a loading state while Auth0 is resolving', () => {
        cy.mount(withProviders(<Profile />, { auth0: mockAuth0({ isLoading: true }) }))
        cy.contains('Loading ...')
    })

    it('renders nothing when not authenticated', () => {
        cy.mount(withProviders(<Profile />, { auth0: mockAuth0({ isLoading: false, isAuthenticated: false }) }))
        cy.get('.profile').should('not.exist')
    })

    it('shows the user name and picture when authenticated', () => {
        const user = { name: 'Kyle Boomer', picture: 'https://example.com/avatar.png' }
        cy.mount(withProviders(<Profile />, {
            auth0: mockAuth0({ isLoading: false, isAuthenticated: true, user }),
        }))
        cy.contains('.profile p', user.name)
        cy.get('.profile img').should('have.attr', 'src', user.picture).and('have.attr', 'alt', user.name)
    })
})
