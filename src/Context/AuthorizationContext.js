import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasPermission, canPerformAction, USER_ROLES } from '../utils/permissions'

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
    const [userRole, setUserRole] = useState(USER_ROLES.USER);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            const role = user['https://stacks.app/roles']?.[0] || user.app.metadata?.role ||
                USER_ROLES.USER;

            setUserRole(role);
            setLoading(false);
        } else {
            setUserRoles(USER_ROLES.USER);
            setLoading(false);
        }
    }, [isAuthenticated, user]);

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
        <AuthorizationContext.Provider value = {value}>
            {children}
        </AuthorizationContext.Provider>
    );
};