import { useNavigate } from 'react-router-dom'
import { useStack } from './MyStack'
import PropTypes from 'prop-types'
import '../CSS/Record.css'

function Album({ album, addToStack }) {
    const navigate = useNavigate()
    const [myStack] = useStack()

    const handleClick = () => {
        navigate(`/${album.id}`)
    }

    const handleAddToStack = (e) => {
        e.stopPropagation()
        if (!isAlbumInStack(album.id)) {
            addToStack(album)
        }
    }

    const isAlbumInStack = (id) => {
        return myStack.some(album => album.id === id);
    };

    // Check if image URL is valid
    const getImageSrc = () => {
        if (album.imgURL && album.imgURL.trim() !== '') {
            return album.imgURL;
        }
        // Return a placeholder image URL or a default image
        return 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Part_of_Record_Collection_%285012173261%29.jpg';
    };

    return (
        <div className="album-cards" onClick={handleClick}>
            <img 
                src={getImageSrc()} 
                alt={`${album.albumName || 'Unknown Album'} cover`}
                onError={(e) => {
                    // Fallback if the image fails to load
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
            </div>
        </div>
    )
}

Album.propTypes = {
    album: PropTypes.shape({
        id: PropTypes.string.isRequired,
        albumName: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        genre: PropTypes.string.isRequired,
        imgURL: PropTypes.string // Changed from .isRequired since it can be undefined
    }).isRequired,
    addToStack: PropTypes.func.isRequired,
}

export default Album