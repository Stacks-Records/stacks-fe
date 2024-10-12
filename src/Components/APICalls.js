const BASE_URL = 'http://localhost:3001'

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

// export const addStack = async (album) => {
//     try {
//         const res = await fetch(`${BASE_URL}/add-stack`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(album)
//         })
//         if (!res.ok) {
//             throw new Error('Failed to add album.')
//         }
//         const newAlbum = await res.json()
//         return newAlbum
//     } catch (error) {
//         console.error('Error:', error.message)
//         throw error
//     }
// }

// export const deleteAlbum = async (albumId) => {
//     try {
//         const res = await fetch(`${BASE_URL}/albums/${albumId}`, {
//             method: 'DELETE'
//         })
//         if (!res.ok) {
//             throw new Error('Failed to delete album.')
//         }
//     } catch (error) {
//         console.error('Error:', error.message)
//         throw error
//     }
// }

export const getUsers = async (token) => {
    try {
        const users = await fetch(`${BASE_URL}/api/v1/users`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
    catch (error) {
        console.log({ error: error.message })
    }
}
export const postUser = async (user, token) => {
    const {name, email} = user
    const newUser = {name, email}
    try {
        const response = fetch(`${BASE_URL}/api/v1/users`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(newUser)
        })
     
        // const result = await response.json()
        // return result
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
        console.log(resp)
        return resp.json()})
}