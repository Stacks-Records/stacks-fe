const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
// const BASE_URL = 'http://localhost:3001'

export const getUserRole = async (email, token) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Email': email
        }
    })
    if (!res.ok) throw new Error('Failed to fetch user role.')
    return res.json()
}

export const getRecords = async (token) => {

   try {
        const res = await fetch(`${BASE_URL}/albums`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
            }
        })
        
        if (!res.ok) {
            throw new Error('Failed to fetch Records.')
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error('Failed to fetch records.', error.message)
        throw error
    }
}

export const getRecordById = async (id, token) => {
    const res = await fetch(`${BASE_URL}/albums/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    if (!res.ok) return null                      // backend sends 400 when missing
    const data = await res.json()                 // backend sends an ARRAY
    return Array.isArray(data) ? (data[0] ?? null) : data
}

export const getGenres = async (token) => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/genres`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!res.ok) throw new Error('Failed to fetch genres.')
        return res.json()
    } catch (error) {
        console.error('Failed to fetch genres.', error.message)
        throw error
    }
}


export const getAlbumsByGenre = async (token, limit = 20) => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/albums/by-genre?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        if (!res.ok) throw new Error('Failed to fetch albums by genre.')
        return res.json()
    } catch (error) {
        console.error('Failed to fetch albums by genre.', error.message)
        throw error
    }
}

export const getUsers = async (token) => {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!res.ok) throw new Error('Failed to fetch users.')
        return res.json()
    }
    catch (error) {
        console.log({ error: error.message })
        throw error
    }
}

export const deleteAlbum = async (id, token) => {
    const res = await fetch(`${BASE_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete album.')
    }
}

export const editAlbum = async (id, albumData, token) => {
    const res = await fetch(`${BASE_URL}/albums/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(albumData)
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to edit album.')
    }
    return res.json()
}

export const updateUserRole = async (id, role, token) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/${id}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
    })
    if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update user role.')
    }
    return res.json()
}
export const postUser = async (user, token) => {
    const {name, email} = user
    const newUser = {name, email}
    try {
        await fetch(`${BASE_URL}/api/v1/users`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(newUser)
        })
    }
    catch (error) {
        console.log({error: error.message})
        throw error
    }
}

export const getStack = async (email, token) => {
    return await fetch(`${BASE_URL}/api/v1/stacks`, {
        method:'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Email':email
        },
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error ('Could not fetch user stack')
        }
        return resp.json()
    })
}

export const addStack = async (email, newAlbum, token) => {
    const userStack = {email, newAlbum}
    return await fetch(`${BASE_URL}/api/v1/stacks`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(userStack)
    })
    .then(resp => {
        console.log(resp)
        return resp.json()})
    
}

export const deleteStack = async (email, albumToDelete, token) => {
    const userStackDelete = {email, albumToDelete}
    return await fetch(`${BASE_URL}/api/v1/stacks/delete`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(userStackDelete)
    })
    .then(resp => {
        return resp.json()})
}

export const postAlbum = async (token,album) => {
        try {
            const res = await fetch(`${BASE_URL}/add-stack`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(album)
            })
            if (!res.ok) {
                throw new Error('Failed to add album.')
            }
            const newAlbum = await res.json()
            return newAlbum
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    }