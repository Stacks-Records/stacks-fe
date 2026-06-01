import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasPermission, canPerformAction, USER_ROLES } from '../utils/permissions';
import { getUserRole } from '../Components/APICalls';

const AuthorizationContext = createContext();

export const useAuthorization = () => {
    const context = useContext(AuthorizationContext);
    if (!context) {
        throw new Error('useAuthorization must be used within AuthorizationProvider')
    }
    return context;
}

export const AuthorizationProvider = ({ children }) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [userRole, setUserRole] = useState(USER_ROLES.USER);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            setUserRole(USER_ROLES.USER);
            setLoading(false);
            return;
        }

        const fetchRole = async () => {
            try {
                const token = await getAccessTokenSilently();
                const data = await getUserRole(user.email, token);
                setUserRole(data.role || USER_ROLES.USER);
            } catch {
                setUserRole(USER_ROLES.USER);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [isAuthenticated, user, getAccessTokenSilently]);

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
        loading
    };

    return (
        <AuthorizationContext.Provider value={value}>
            {children}
        </AuthorizationContext.Provider>
    );
};
