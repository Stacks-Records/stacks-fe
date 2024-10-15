import { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecords, postAlbum } from './APICalls'
import '../CSS/AddStack.css'
import { useAuth0 } from '@auth0/auth0-react'
import AuthAlbumContext from '../Context/AuthAlbumContext'

function AddStack() {
    const formRef = useRef()
    const [successtext, setSuccessText] = useState('')
    const { albums, setAlbums } = useContext(AuthAlbumContext)
    const { authCode } = useContext(AuthAlbumContext)
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        const album = Object.fromEntries(formData.entries())
        console.log(album)
        album.isBandTogether = formData.get('isBandTogether') === 'on'
        album.bandMembers = formData.getAll('bandMembers')

        try {
            console.log('submitting album:', album)
            const result = await postAlbum(authCode, album)
            const getAlbums = async () => {
                try {
                    const updatedAlbums = await getRecords(authCode)
                    setAlbums(updatedAlbums)
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
            <div className='h-text-wrapper'>

                <h1>Add Album to Stacks</h1>

            </div>
        <form ref={formRef} onSubmit={handleSubmit} className='add-stack-form'>

            <div className="input-group">
                <label><sub>*</sub>Album Name</label>
                <input required type="text" name="albumName" placeholder="Album Name" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Artist</label>
                <input required type="text" name="artist" placeholder="Artist" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Release Date</label>
                <input required type="date" name="releaseDate" placeholder="Release Date" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Genre</label>
                <input required type="text" name="genre" placeholder="Genre" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Label</label>
                <input required type="text" name="label" placeholder="Label" />
            </div>
          
            <div className="input-group">
                <label><sub>*</sub>Rolling Stone Review</label>
                <input required type="text" name="rollingStoneReview" placeholder="* / ** / *** / **** / *****" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Youtube Album URL</label>
                <input required type="url" name="youTubeAlbumURL" placeholder="YouTube Album URL" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Image URL</label>
                <input required type="url" name="imgURL" placeholder="Image URL" />
            </div>
            <div className="input-group">
                <label><sub>*</sub>Albums Sold</label>
                <input required type="number" name="albumsSold" placeholder="Albums Sold" />
            </div>
            <div className='input-group'>
                <label><sub>*</sub>Band Members</label>
                <input type="text" name="bandMembers" placeholder="Band Members" />
            </div>
            <div className='input-group'>
                <label>
                <sub>*</sub>Are they still together?
                </label>
                <input type="checkbox" name="isBandTogether" />
            </div>
            <button type="submit">Add Album</button>
            {error && <p className="error">{error}</p>}
            <div className='required-text'><sub>*</sub>Indicates required field</div>
            </form>
        </div>
    )
}

export default AddStack