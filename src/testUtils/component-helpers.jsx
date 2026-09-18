import { MemoryRouter } from 'react-router-dom'
import { Auth0Context } from '@auth0/auth0-react'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import AuthorizationContext from '../Context/AuthorizationContext'

// Wraps a component under test with whichever of the app's real contexts it
// needs, each given directly as a value rather than mounting the real
// provider (which would fetch from the network/Auth0). Only the contexts
// passed in are wrapped, so a spec only pays for the mocking it needs.
export function withProviders(ui, { myStack, authAlbum, authorization, auth0, route = '/' } = {}) {
    let wrapped = ui

    if (authorization) {
        wrapped = (
            <AuthorizationContext.Provider value={authorization}>
                {wrapped}
            </AuthorizationContext.Provider>
        )
    }
    if (authAlbum) {
        wrapped = (
            <AuthAlbumContext.Provider value={authAlbum}>
                {wrapped}
            </AuthAlbumContext.Provider>
        )
    }
    if (myStack) {
        wrapped = (
            <MyStackContext.Provider value={myStack}>
                {wrapped}
            </MyStackContext.Provider>
        )
    }
    if (auth0) {
        wrapped = (
            <Auth0Context.Provider value={auth0}>
                {wrapped}
            </Auth0Context.Provider>
        )
    }

    return (
        <MemoryRouter initialEntries={[route]}>
            {wrapped}
        </MemoryRouter>
    )
}

// A no-op Auth0 context value with every field a component might read,
// spreadable and overridable per-test: mockAuth0({ isAuthenticated: true }).
export function mockAuth0(overrides = {}) {
    return {
        isAuthenticated: false,
        isLoading: false,
        user: undefined,
        loginWithRedirect: cy.stub().as('loginWithRedirect'),
        logout: cy.stub().as('logout'),
        ...overrides,
    }
}
