import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import '../CSS/Record.css'

function Album({ album, addToStack }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/${album.id}`)
    }

    const handleAddtoStack = (e) => {
        e.stopPropagation()
       if(typeof addToStack === 'function') {
        addToStack(album)
       } else {
        console.error('addToStack is not a function.')
       }
    }


    return (
        <div className="album-cards" onClick={handleClick}>
            <img src={album.imgURL} alt={`${album.title} cover`} />
            <div className="album-info">
                <h3>{album.artist}</h3>
                <h4>{album.albumName}</h4>
                <p>{album.genre}</p>
                <button className="record-button"onClick={handleAddtoStack}>Add to My Stack</button>
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
        imgURL: PropTypes.string.isRequired
    }).isRequired,
    addToStack: PropTypes.func.isRequired
}


export default Album