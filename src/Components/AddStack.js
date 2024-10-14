import { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecords, postAlbum } from './APICalls'
import '../CSS/AddStack.css'
import { useAuth0 } from '@auth0/auth0-react'
import AuthAlbumContext from '../Context/AuthAlbumContext'

function AddStack() {
    const formRef = useRef()
    const [successtext, setSuccessText] = useState('')
    const { albums, setAlbums } = useContext(MyStackContext)
    const { authCode } = useContext(AuthAlbumContext)
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        const album = Object.fromEntries(formData.entries())
        album.isBandTogether = formData.get('isBandTogether') === 'on'
        album.bandMembers = formData.getAll('bandMembers')

        try {
            console.log('submitting album:', album)
            const result = await postAlbum(authCode, album)
            const getAlbums = async () => {
                try {
                    const albums = await getRecords(authCode)
                    setAlbums(albums)
                }
                catch (error) {
                    console.log(error)
                }
            }
            getAlbums()
            navigate('/landing')
        } catch (error) {
            console.error('Error:', error.message)
            setError('Failed to add album. Please try again.')
        }
    }

    return (
        <div className="add-stack">
            <h1>Add Album to Stacks</h1>
            <form ref={formRef} onSubmit={handleSubmit}>
            <input required type="text" name="albumName" placeholder="Album Name" />
                <input required type="text" name="artist" placeholder="Artist" />
                <input required type="date" name="releaseDate" placeholder="Release Date" />
                <input required type="text" name="genre" placeholder="Genre" />
                <input required type="text" name="label" placeholder="Label" />
                <div>
                    <label>
                        Are they still together?
                        <input type="checkbox" name="isBandTogether" />
                    </label>
                </div>
                <input required type="text" name="rollingStoneReview" placeholder="Rolling Stone Review" />
                <input required type="url" name="youTubeAlbumURL" placeholder="YouTube Album URL" />
                <input required type="url" name="imgURL" placeholder="Image URL" />
                <input required type="number" name="albumsSold" placeholder="Albums Sold" />
                
                <div>
                    <input type="text" name="bandMember" placeholder="Band Member" />
                    <button onClick={handleAddMember}>Add Member</button>
                    <ul id="membersList"></ul>
                </div>
                <button type="submit">Add Album</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default AddStack