import LogoutButton from './LogoutButton'
import { withProviders, mockAuth0 } from '../testUtils/component-helpers'

describe('LogoutButton', () => {
    it('renders nothing when not authenticated', () => {
        cy.mount(withProviders(<LogoutButton />, { auth0: mockAuth0({ isAuthenticated: false }) }))
        cy.get('button').should('not.exist')
    })

    it('logs out with the current origin as returnTo when clicked', () => {
        const auth0 = mockAuth0({ isAuthenticated: true })
        cy.mount(withProviders(<LogoutButton />, { auth0 }))
        cy.contains('button', 'Log Out').click()
        cy.get('@logout').should('have.been.calledWith', {
            logoutParams: { returnTo: window.location.origin },
        })
    })
})
