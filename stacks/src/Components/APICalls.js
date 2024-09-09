const BASE_URL = 'http://localhost:10000'

export const getRecords = async () => {

    try {
        const res = await fetch(`${BASE_URL}/albums`)
        if (!res.ok) {
            throw new Error('Failed to fetch Records.')
        }
        const data = await res.json()
        return data
    } catch(error) {
        console.error('Failed to fetch records.', error.message)
        throw error
    }
}

export const addStack = async (album) => {
    try {
        const res = await fetch(`${BASE_URL}/add-stack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(album)
        })
        if(!res.ok) {
            throw new Error('Failed to add album.')
        }
        const newAlbum = await res.json()
        return newAlbum
    } catch(error) {
        console.error('Error:', error.message)
        throw error
    }
}

export const deleteAlbum = async(albumId) => {
    try {
        const res = await fetch(`${BASE_URL}/albums/${albumId}`, {
            method: 'DELETE'
        })
        if(!res.ok) {
            throw new Error('Failed to delete album.')
        }
    } catch(error) {
        console.error('Error:', error.message) 
        throw error
    }
}