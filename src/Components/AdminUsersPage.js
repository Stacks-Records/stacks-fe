import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuthorization } from '../Context/AuthorizationContext'
import { PERMISSIONS, USER_ROLES } from '../utils/permissions'
import { getUsers, updateUserRole } from './APICalls'
import '../CSS/AdminUsersPage.css'

function AdminUsersPage() {
    const { authCode } = useContext(AuthAlbumContext)
    const { checkPermission, loading } = useAuthorization()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        if (loading) return
        if (!checkPermission(PERMISSIONS.MANAGE_USERS)) {
            navigate('/landing')
            return
        }
        getUsers(authCode)
            .then(setUsers)
            .catch(() => setError('Failed to load users.'))
    }, [loading, authCode, checkPermission, navigate])

    const handleRoleChange = async (userId, newRole) => {
        try {
            const updated = await updateUserRole(userId, newRole, authCode)
            setUsers(users.map(u => u.id === userId ? { ...u, role: updated.role } : u))
        } catch (err) {
            setError('Failed to update role. Please try again.')
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="admin-users-page">
            <h1>User Management</h1>
            {error && <p className="admin-error">{error}</p>}
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role || USER_ROLES.USER}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    {Object.values(USER_ROLES).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminUsersPage
