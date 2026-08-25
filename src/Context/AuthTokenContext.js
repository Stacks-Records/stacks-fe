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
    const [token, setToken] = useState(() => {
        try {
            const stored = localStorage.getItem('authAccessToken')
            return stored ? JSON.parse(stored) : ''
        } catch {
            return ''
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isReauthenticating, setIsReauthenticating] = useState(false);

    const reauthenticate = useCallback(() => {
        setIsReauthenticating(true);
        loginWithRedirect({
            appState: { returnTo: window.location.pathname + window.location.search }
        });
    }, [loginWithRedirect]);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        getAccessTokenSilently()
            .then(freshToken => {
                setToken(freshToken);
                localStorage.setItem('authAccessToken', JSON.stringify(freshToken));
                setIsLoading(false);
            })
            .catch(err => {
                if (REAUTH_REQUIRED_ERRORS.includes(err?.error)) {
                    reauthenticate();
                    return;
                }
                console.error(err);
                setIsLoading(false);
            });
    }, [isAuthenticated, getAccessTokenSilently, reauthenticate]);

    const value = { token, isLoading, isReauthenticating };

    return (
        <AuthTokenContext.Provider value={value}>
            {children}
        </AuthTokenContext.Provider>
    );
};
