import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../CSS/AddStack.css'

function AddStack() {
    const [album, setAlbum] = useState({
        albumName: '',
        artist: '',
        releaseDate: '',
        genre: '',
        bandMembers: '',
        label: '',
        isBandTogether: false,
        rollingStoneReview: '',
        youTubeAlbumURL: '',
        imgURL: '',
        albumsSold: ''
    })

    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setAlbum({
            ...album,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(album)
            })
            if (!response.ok) {
                throw new Error('Failed to add your album.')
            }
            const result = await response.json()
            console.log('Album added:', result)
            navigate('/')
        } catch (error) {
            console.error('Error:', error)
            setError('Failed to add album. Please try again')
        }
    }

    return (
        <div className="add-stack">
            <h1>Add Album to Stack</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(album).map((key) => (
                    key === 'isBandTogether' ? (
                        <div key={key}>
                            <label>
                                <input
                                    type="checkbox"
                                    name={key}
                                    checked={album[key]}
                                    onChange={handleChange}
                                />
                                {key}
                            </label>
                        </div>
                    ) : (
                        <div key={key}>
                            <label>
                                {key}:
                                <input
                                    type={key === 'albumsSold' ? 'number' : 'text'}
                                    name={key}
                                    value={album[key]}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    )
                ))}
                <button type="submit">Add Album</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default AddStack