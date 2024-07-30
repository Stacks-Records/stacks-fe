import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStack } from './APICalls'
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
        const result = await addStack(album)
        console.log('Album added:', result)
        navigate('/')
    } catch(error) {
        console.error('Error:', error.message)
        setError('Failed to add album. Please try again.')
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