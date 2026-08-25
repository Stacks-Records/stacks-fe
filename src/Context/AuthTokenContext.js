import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthTokenContext = createContext();

export const useAuthToken = () => {
    const context = useContext(AuthTokenContext);
    if (!context) {
        throw new Error('useAuthToken must be used within AuthTokenProvider')
    }
    return context;
}

// Errors auth0-spa-js throws from getAccessTokenSilently when silent renewal is
// impossible and only an interactive login can recover the session.
const REAUTH_REQUIRED_ERRORS = ['missing_refresh_token', 'login_required', 'consent_required'];

export const AuthTokenProvider = ({ children }) => {
    const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    // Starts empty rather than seeded from localStorage. Every consumer
    // already treats a falsy token as "not ready" (the same `if (!authCode)
    // return` idiom used throughout this app) — gating on the token's own
    // value, not a separate isLoading flag, is what makes that gate reliable:
    // if this provider's fetch effect ends up running more than once (e.g.
    // isAuthenticated settling in multiple steps after the redirect
    // callback) and resolves to the same token twice, setToken(sameValue) is
    // a no-op, so consumers never see a second, spurious "ready" transition.
    // A boolean flag doesn't have that property — it can legitimately flip
    // false->true->false on every run even when the resolved value never
    // changes, which was re-firing every token-gated effect twice.
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isReauthenticating, setIsReauthenticating] = useState(false);

    const reauthenticate = useCallback(() => {
        setIsReauthenticating(true);
        loginWithRedirect({
            appState: { returnTo: window.location.pathname + window.location.search }
        });
    }, [loginWithRedirect]);

    useEffect(() => {
        // Guards against a stale run's result landing after a newer one —
        // e.g. isAuthenticated flickering during Auth0's redirect-callback
        // processing would otherwise let an in-flight promise from a
        // superseded run flip isLoading back to false (or overwrite token)
        // after a later run already resolved, letting consumers fire on a
        // window that isn't really "ready."
        let ignore = false;

        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        // Set explicitly (not just relying on the initial state) so every
        // run of this effect — not only the first — marks the token as not
        // ready until this specific run resolves.
        setIsLoading(true);
        getAccessTokenSilently()
            .then(freshToken => {
                if (ignore) return;
                setToken(freshToken);
                localStorage.setItem('authAccessToken', JSON.stringify(freshToken));
                setIsLoading(false);
            })
            .catch(err => {
                if (ignore) return;
                if (REAUTH_REQUIRED_ERRORS.includes(err?.error)) {
                    reauthenticate();
                    return;
                }
                console.error(err);
                // Clear the token rather than leaving a previous run's value
                // in place — consumers gate on the token's own truthiness,
                // so a value nobody just confirmed is valid must not linger.
                setToken('');
                setIsLoading(false);
            });

        return () => { ignore = true };
    }, [isAuthenticated, getAccessTokenSilently, reauthenticate]);

    const value = { token, isLoading, isReauthenticating };

    return (
        <AuthTokenContext.Provider value={value}>
            {children}
        </AuthTokenContext.Provider>
    );
};
