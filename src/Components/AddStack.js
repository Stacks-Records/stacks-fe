import { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { getRecords, postAlbum, editAlbum, getGenres } from './APICalls'
import { isValidYouTubeURL, isImageReachable, toDateInputValue } from '../utils/validation'
import { getAlbumGenreNames } from '../utils/genres'
import '../CSS/AddStack.css'
import AuthAlbumContext from '../Context/AuthAlbumContext'

function AddStack() {
    const formRef = useRef()
    const { setAlbums, authCode } = useContext(AuthAlbumContext)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [isValidating, setIsValidating] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const albumToEdit = location.state?.albumToEdit ?? null
    const isEditMode = Boolean(albumToEdit)

    const [genreOptions, setGenreOptions] = useState([])
    const [selectedGenres, setSelectedGenres] = useState(() =>
        getAlbumGenreNames(albumToEdit?.genres, albumToEdit?.genre).map(name => ({ value: name, label: name }))
    )

    useEffect(() => {
        if (!authCode) return
        getGenres(authCode)
            .then(data => {
                const normalized = data.map(g =>
                    typeof g === 'string' ? { name: g, isCanonical: true } : g
                )
                setGenreOptions(normalized.map(g => ({ value: g.name, label: g.name })))
            })
            .catch(err => console.error('Failed to load genre options.', err.message))
    }, [authCode])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        const album = Object.fromEntries(formData.entries())
        album.isBandTogether = formData.get('isBandTogether') === 'on'
        album.bandMembers = formData.getAll('bandMembers')
        album.albumsSold = Number(album.albumsSold)
        album.genres = selectedGenres.map(g => g.value)

        const errors = {}
        if (album.genres.length === 0) {
            errors.genres = 'Select at least one genre.'
        }
        if (!isValidYouTubeURL(album.youTubeAlbumURL)) {
            errors.youTubeAlbumURL = 'Enter a valid YouTube link (e.g. https://youtu.be/...)'
        }
        setIsValidating(true)
        const imageOk = await isImageReachable(album.imgURL)
        setIsValidating(false)
        if (!imageOk) {
            errors.imgURL = 'That image link could not be loaded. Check the URL.'
        }
        if (Object.keys(errors).length) {
            setFieldErrors(errors)
            return
        }
        setFieldErrors({})

        try {
            if (isEditMode) {
                await editAlbum(albumToEdit.id, album, authCode)
            } else {
                await postAlbum(authCode, album)
            }
            const updatedAlbums = await getRecords(authCode)
            setAlbums(updatedAlbums)
            navigate(isEditMode ? `/${albumToEdit.id}` : '/landing')
        } catch (error) {
            console.error('Error:', error.message)
            setError(isEditMode ? 'Failed to update album. Please try again.' : 'Failed to add album. Please try again.')
        }
    }

    return (
        <div className="add-stack">
            <div className='h-text-wrapper'>
                <h1>{isEditMode ? 'Edit Album' : 'Add Album to Stacks'}</h1>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className='add-stack-form'>
                <div className="input-group">
                    <label><sub>*</sub>Album Name</label>
                    <input required type="text" name="albumName" placeholder="Album Name" defaultValue={albumToEdit?.albumName ?? ''} />
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Artist</label>
                    <input required type="text" name="artist" placeholder="Artist" defaultValue={albumToEdit?.artist ?? ''} />
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Release Date</label>
                    <input required type="date" name="releaseDate" placeholder="Release Date" defaultValue={toDateInputValue(albumToEdit?.releaseDate)} />
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Genre</label>
                    <CreatableSelect
                        isMulti
                        classNamePrefix="genre-select"
                        inputId="genre-select"
                        options={genreOptions}
                        value={selectedGenres}
                        onChange={(selected) => setSelectedGenres(selected ?? [])}
                        placeholder="Genre(s)"
                        aria-label="Genre(s)"
                    />
                    {fieldErrors.genres && <span className="field-error">{fieldErrors.genres}</span>}
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Label</label>
                    <input required type="text" name="label" placeholder="Label" defaultValue={albumToEdit?.label ?? ''} />
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Rolling Stone Review</label>
                    <input required type="text" name="rollingStoneReview" placeholder="* / ** / *** / **** / *****" defaultValue={albumToEdit?.rollingStoneReview ?? ''} />
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Youtube Album URL</label>
                    <input required type="text" name="youTubeAlbumURL" placeholder="YouTube Album URL" defaultValue={albumToEdit?.youTubeAlbumURL ?? ''} />
                    {fieldErrors.youTubeAlbumURL && <span className="field-error">{fieldErrors.youTubeAlbumURL}</span>}
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Image Cover</label>
                    <input required type="text" name="imgURL" placeholder="Image URL" defaultValue={albumToEdit?.imgURL ?? ''} />
                    {fieldErrors.imgURL && <span className="field-error">{fieldErrors.imgURL}</span>}
                </div>
                <div className="input-group">
                    <label><sub>*</sub>Albums Sold</label>
                    <input required type="number" name="albumsSold" placeholder="Albums Sold" defaultValue={albumToEdit?.albumsSold ?? ''} />
                </div>
                <div className='input-group'>
                    <label><sub>*</sub>Band Members</label>
                    <input type="text" name="bandMembers" placeholder="Band Members" defaultValue={albumToEdit?.bandMembers ?? ''} />
                </div>
                <div className='input-group'>
                    <label><sub>*</sub>Are they still together?</label>
                    <input type="checkbox" name="isBandTogether" defaultChecked={albumToEdit?.isBandTogether ?? false} />
                </div>
                <button type="submit" disabled={isValidating}>{isValidating ? 'Checking…' : (isEditMode ? 'Save Changes' : 'Add Album')}</button>
                {error && <p className="error">{error}</p>}
                <div className='required-text'><sub>*</sub>Indicates required field</div>
            </form>
        </div>
    )
}

export default AddStack
