const getRecords = async () => {

    try {
        const res = await fetch('https://stacks-api-6hnx.onrender.com/albums')
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

export {getRecords}