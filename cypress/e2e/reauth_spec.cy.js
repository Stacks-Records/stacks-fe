// Simulates the "Missing Refresh Token" bug: seeds the auth0-spa-js cache
// like stubGoogleLogin does, but with an expired token entry that has no
// refresh_token in its body. auth0-spa-js's _getTokenUsingRefreshToken
// checks the cache for a refresh_token before making any network request —
// if it's absent (and there's no worker), it throws MissingRefreshTokenError
// synchronously (err.error === 'missing_refresh_token'). That's the exact
// client-side condition AuthTokenContext's catch block reacts to, so this
// reproduces the bug without depending on real Auth0 tenant state.
describe('Auth0 — missing refresh token triggers re-authentication', () => {
  it('redirects to Auth0 login when the cached session has no refresh token', () => {
    const clientId = Cypress.env('auth0_client_id')
    const audience = Cypress.env('auth0_audience')
    const domain = Cypress.env('auth0_domain')
    const scope = 'openid profile email offline_access'

    cy.fixture('token.json').then(([{ token }]) => {
      cy.fixture('user.json').then(([user]) => {
        const decodedUser = {
          sub: 'google-oauth2|10822501943092869162',
          email: user.email,
          name: user.username,
          email_verified: true,
        }
        const body = {
          client_id: clientId,
          access_token: token,
          id_token: token,
          scope,
          expires_in: 86400,
          decodedToken: { claims: decodedUser, user: decodedUser },
          audience,
          oauthTokenScope: scope,
          // No refresh_token field — this is what makes the SDK throw
          // missing_refresh_token instead of silently renewing.
        }
        // Expired an hour ago, so getAccessTokenSilently() can't just
        // return the cached access token and is forced into the refresh
        // flow that trips over the missing refresh_token.
        const cacheEntry = { body, expiresAt: Math.floor(Date.now() / 1000) - 3600 }
        const userEntry = { id_token: token, decodedToken: { claims: decodedUser, user: decodedUser } }

        cy.visit('/', {
          onBeforeLoad(win) {
            win.localStorage.setItem(
              `@@auth0spajs@@::${clientId}::${audience}::${scope}`,
              JSON.stringify(cacheEntry)
            )
            win.localStorage.setItem(
              `@@auth0spajs@@::${clientId}::@@user@@`,
              JSON.stringify(userEntry)
            )
          },
        })

        // AuthTokenContext should catch the missing_refresh_token error and
        // call loginWithRedirect(), sending the browser to Auth0's Universal
        // Login — never leaving the user stuck on a silently broken session.
        cy.url({ timeout: 10000 }).should('include', domain)
      })
    })
  })
})
