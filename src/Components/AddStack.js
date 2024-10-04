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
        bandMembers: [],
        label: '',
        isBandTogether: false,
        rollingStoneReview: '',
        youTubeAlbumURL: '',
        imgURL: '',
        albumsSold: ''
    })

    const [bandMember, setBandMember] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setAlbum({
            ...album,
            [name]: type === 'checkbox' ? checked : value
        })
    }
    const handleAddMember = (e) => {
        e.preventDefault()
        if (bandMember.trim()) {
            setAlbum({
                ...album,
                bandMembers:[...album.bandMembers, bandMember]
            })
            setBandMember('')
        }
    }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        const result = await addStack(album)
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
                            Are they still together?
                            <input required
                                type="checkbox"
                                name={key}
                                checked={album[key]}
                                onChange={handleChange}
                            />
                            
                        </label>
                    </div>
                ) : key !== 'bandMembers' ? (
                    <div key={key}>
                        <label>
                            {key.toUpperCase()}:
                            <input required
                                type={key === 'albumsSold' ? 'number' : 'text'}
                                name={key}
                                value={album[key]}
                                onChange={handleChange}
                            />
                        </label>
                    </div> 
                ) : null
            ))}
            <div>
                <label>
                    BAND MEMBERS: 
                    <input required 
                    type="text"
                    value={bandMember}
                    onChange={(e) => setBandMember(e.target.value)}
                    />
                    <button onClick={handleAddMember}>Add Members</button>
                    <ul>
                        {album.bandMembers.map((member, index) => (
                            <li key={index}>{member}</li>
                        ))}
                    </ul>
                </label>
            </div>
            <button type="submit">Add Album</button>
            {error && <p className="error">{error}</p>}
        </form>
    </div>
)
}

export default AddStack