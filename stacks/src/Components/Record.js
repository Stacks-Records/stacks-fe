import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import '../CSS/Record.css'

function Album({ album }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/album/${album.id}`)
    }


    return (
        <div className="album-cards" onClick={handleClick}>
            <img src={album.imgURL} alt={`${album.title} cover`} />
            <h3>{album.artist}</h3>
            <h4>{album.albumName}</h4>
            <p>{album.genre}</p>
        </div>
    )
}

Album.propTypes = {
    album: PropTypes.shape({
        id: PropTypes.string.isRequired,
        albumName: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        releaseDate: PropTypes.string,
        genre: PropTypes.string.isRequired,
        bandMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
        label: PropTypes.string.isRequired,
        isBandTogether: PropTypes.bool.isRequired,
        rollingStoneReview: PropTypes.string,
        youTubeAlbumURL: PropTypes.string.isRequired,
        imgURL: PropTypes.string.isRequired,
        albumsSold: PropTypes.number,
    }).isRequired,
};


export default Album