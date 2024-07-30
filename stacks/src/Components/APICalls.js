const BASE_URL = 'https://stacks-api-6hnx.onrender.com'

export const getRecords = async () => {

    try {
        const res = await fetch(`${BASE_URL}/albums`)
        if (!res.ok) {
            throw new Error('Failed to fetch Records.')
        }
        const data = await res.json()
        return data
    } catch(error) {
        console.error('Failed to fetch records.', error)
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
        console.error('Error', error.message)
    }
}