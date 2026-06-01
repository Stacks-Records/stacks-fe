import { useNavigate } from 'react-router-dom'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuthorization } from '../Context/AuthorizationContext'
import { PERMISSIONS } from '../utils/permissions'
import { deleteAlbum } from './APICalls'
import '../CSS/Record.css'
import { useContext } from 'react'

function Album({ album, addToStack }) {
    const navigate = useNavigate()
    const { myStack } = useContext(MyStackContext)
    const { albums, setAlbums, authCode } = useContext(AuthAlbumContext)
    const { checkAction } = useAuthorization()

    const handleClick = () => {
        navigate(`/${album.id}`)
    }

    const handleAddToStack = (e) => {
        e.stopPropagation()
        if (!isAlbumInStack(album.id)) {
            addToStack(album)
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        navigate('/add-stack', { state: { albumToEdit: album } })
    }

    const handleDelete = async (e) => {
        e.stopPropagation()
        if (!window.confirm(`Delete "${album.albumName}"? This cannot be undone.`)) return
        try {
            await deleteAlbum(album.id, authCode)
            setAlbums(albums.filter(a => a.id !== album.id))
        } catch (error) {
            console.error('Failed to delete album:', error.message)
            alert('Could not delete album. Please try again.')
        }
    }

    const isAlbumInStack = (id) => {
        return myStack?.some(a => a.id === id)
    }

    const getImageSrc = () => {
        if (album.imgURL && album.imgURL.trim() !== '') {
            return album.imgURL;
        }
        return 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Part_of_Record_Collection_%285012173261%29.jpg';
    };

    const canEdit = checkAction(PERMISSIONS.EDIT_ALBUM, album.created_by)
    const canDelete = checkAction(PERMISSIONS.DELETE_ALBUM, album.created_by)

    return (
        <div className="album-cards" onClick={handleClick}>
            <img
                src={getImageSrc()}
                alt={`${album.albumName || 'Unknown Album'} cover`}
                onError={(e) => {
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Part_of_Record_Collection_%285012173261%29.jpg';
                }}
            />
            <div className="album-info">
                <h3>{album.artist}</h3>
                <h4>{album.albumName}</h4>
                <p>{album.genre}</p>
                <button className="record-button"
                    onClick={handleAddToStack}
                    disabled={isAlbumInStack(album.id)}
                >
                    {isAlbumInStack(album.id) ? 'Already Got It' : 'Add To My Stack'}
                </button>
                {canEdit && (
                    <button className="edit-button" onClick={handleEdit}>Edit</button>
                )}
                {/* {canDelete && (
                    <button className="delete-btn" onClick={handleDelete}>Delete</button>
                )} */}
            </div>
        </div>
    )
}

export default Album
