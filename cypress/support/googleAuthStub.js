// Seeds the Auth0 SPA JS token cache directly in localStorage so the app
// loads already authenticated as a Google-social user, with zero requests to
// Auth0 or Google. Real OAuth automation against accounts.google.com is
// avoided since Google actively fingerprints/blocks automated browsers.
//
// The cache key/shape below matches @auth0/auth0-spa-js@2.1.3 (the version
// this app's @auth0/auth0-react@2.2.4 depends on) — an undocumented internal
// format, so re-verify against node_modules if that dependency is upgraded.
Cypress.Commands.add('stubGoogleLogin', (url = '/') => {
  const clientId = Cypress.env('auth0_client_id')
  const audience = Cypress.env('auth0_audience')
  // Auth0Provider has useRefreshTokens={true}, which makes auth0-spa-js compute
  // its internal scope as "openid" + authorizationParams.scope + "offline_access"
  // — that computed scope (not the plain provider prop) is the cache key.
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
      }
      const cacheEntry = { body, expiresAt: Math.floor(Date.now() / 1000) + 86400 }
      const userEntry = { id_token: token, decodedToken: { claims: decodedUser, user: decodedUser } }

      cy.visit(url, {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            `@@auth0spajs@@::${clientId}::${audience}::${scope}`,
            JSON.stringify(cacheEntry)
          )
          win.localStorage.setItem(
            `@@auth0spajs@@::${clientId}::@@user@@`,
            JSON.stringify(userEntry)
          )
          // Deliberately NOT seeding the app's own 'authAccessToken' key here.
          // App.js reads it into initial state on mount; if it already held
          // this same token string, App.js's later getAccessTokenSilently()
          // resolution would be a no-op set (identical value), and React
          // bails out of the re-render — so the authCode-gated data-load
          // effect never re-fires. Leaving it unset lets App.js populate it
          // for real via getAccessTokenSilently(), same as a genuine first
          // load with no prior app-level token cached.
        },
      })
    })
  })
})
