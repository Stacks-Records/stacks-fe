import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import '../CSS/Record.css'

function Album({ album, handleFavorite }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/${album.id}`)
    }


    return (
        <div className="album-cards" onClick={handleClick}>
            <img src={album.imgURL} alt={`${album.title} cover`} />
            <div className="album-info">
                <h3>{album.artist}</h3>
                <h4>{album.albumName}</h4>
                <p>{album.genre}</p>
                <button className="record-button"onClick={handleFavorite}>Add to My Stack</button>
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
    }).isRequired,
};


export default Album