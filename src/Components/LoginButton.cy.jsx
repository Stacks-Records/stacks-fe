import LoginButton from './LoginButton'
import { withProviders, mockAuth0 } from '../testUtils/component-helpers'

describe('LoginButton', () => {
    it('renders nothing when already authenticated', () => {
        cy.mount(withProviders(<LoginButton />, { auth0: mockAuth0({ isAuthenticated: true }) }))
        cy.get('button').should('not.exist')
    })

    it('signs in and disables itself while redirecting when clicked', () => {
        const auth0 = mockAuth0({ isAuthenticated: false })
        cy.mount(withProviders(<LoginButton />, { auth0 }))
        cy.contains('button', 'Sign in').should('not.be.disabled').click()
        cy.get('@loginWithRedirect').should('have.been.calledOnce')
        cy.contains('button', 'Signing in…').should('be.disabled')
    })
})
