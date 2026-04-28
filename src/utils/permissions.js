export const USER_ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
};

export const PERMISSIONS = {
    CREATE_ALBUM: 'create_album',
    EDIT_ALBUM: 'edit_album',
    DELETE_ALBUM: 'delete_album',
    VIEW_ALBUM: 'view_album',
    MANAGE_USERS: 'manage_users',
    VIEW_USERS: 'view_users'
};

export const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: [
        PERMISSIONS.CREATE_ALBUM,
        PERMISSIONS.DELETE_ALBUM,
        PERMISSIONS.EDIT_ALBUM,
        PERMISSIONS.VIEW_ALBUM,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.MANAGE_USERS
    ],
    [USER_ROLES.MODERATOR]: [
        PERMISSIONS.CREATE_ALBUM,
        PERMISSIONS.EDIT_ALBUM,
        PERMISSIONS.DELETE_ALBUM,
        PERMISSIONS.VIEW_ALBUM,
        PERMISSIONS.VIEW_USERS
    ],
    [USER_ROLES.USER]: [
        PERMISSIONS.VIEW_ALBUM,
        PERMISSIONS.CREATE_ALBUM,
        PERMISSIONS.EDIT_ALBUM
    ]
}

export const hasPermission = (userRole, permission) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
        return false;
    }
    return ROLE_PERMISSIONS[userRole].includes(permission);
}

export const canPerformAction = (userRole, permission, resourceOwnerId = null, userId = null) => {
    if (userRole === USER_ROLES.ADMIN) {
        return true
    }

    if (!hasPermission(userRole, permission)) {
        return false;
    }

    if (permission === PERMISSIONS.EDIT_ALBUM || permission === PERMISSIONS.DELETE_ALBUM) {
        if (userRole === USER_ROLES.MODERATOR) {
            return true;
        }
        return resourceOwnerId === userId;
    }

    return true;
};
