import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasPermission, canPerformAction, USER_ROLES } from '../utils/permissions';
import { getUserRole } from '../Components/APICalls';
import { useAuthToken } from './AuthTokenContext';

const AuthorizationContext = createContext();

export const useAuthorization = () => {
    const context = useContext(AuthorizationContext);
    if (!context) {
        throw new Error('useAuthorization must be used within AuthorizationProvider')
    }
    return context;
}

export const AuthorizationProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth0();
    const userEmail = user?.email;
    const { token, isReauthenticating } = useAuthToken();
    const [userRole, setUserRole] = useState(USER_ROLES.USER);
    const [loading, setLoading] = useState(true);
    const [roleFetchError, setRoleFetchError] = useState(false);

    // Gated on token's own truthiness (empty until AuthTokenContext confirms
    // a real token) rather than an isLoading flag, so a redundant upstream
    // fetch resolving to the same token can't re-fire this. Also depends on
    // userEmail, not the whole user object, since useAuth0() can hand out a
    // new user object reference without the underlying profile changing.
    useEffect(() => {
        if (!isAuthenticated || !userEmail) {
            setUserRole(USER_ROLES.USER);
            setLoading(false);
            return;
        }
        if (!token || isReauthenticating) {
            setLoading(true);
            return;
        }

        const fetchRole = async () => {
            setRoleFetchError(false);
            try {
                const data = await getUserRole(userEmail, token);
                setUserRole(data.role || USER_ROLES.USER);
            } catch (err) {
                console.error('AuthorizationProvider fetchRole failed:', err);
                setUserRole(USER_ROLES.USER);
                setRoleFetchError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [isAuthenticated, userEmail, token, isReauthenticating]);

    const checkPermission = (permission) => {
        return hasPermission(userRole, permission);
    };

    const checkAction = (permission, resourceOwnerId = null) => {
        return canPerformAction(userRole, permission, resourceOwnerId, user?.sub);
    };

    const value = {
        userRole,
        checkPermission,
        checkAction,
        isAdmin: userRole === USER_ROLES.ADMIN,
        isModerator: userRole === USER_ROLES.MODERATOR,
        loading,
        roleFetchError
    };

    return (
        <AuthorizationContext.Provider value={value}>
            {children}
        </AuthorizationContext.Provider>
    );
};
