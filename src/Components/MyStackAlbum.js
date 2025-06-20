import {useNavigate} from 'react-router-dom'
import '../CSS/MyStackAlbum.css'

const MyStackAlbum = ({album, handleDelete}) => {
const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/${album.id}`)
    }

    const ifTrashStayHere = (e) => {
        e.stopPropagation()
        handleDelete(album)
    }

    return (
        <div className="album-cards" onClick={handleClick}>
        <img src={album.imgURL} alt={`${album.title} cover`} />
        <div className="album-info">
            <h3>{album.artist}</h3>
            <h4>{album.albumName}</h4>
            <p>{album.genre}</p>
            <button className="delete-button"onClick={ifTrashStayHere}>Toss This Record</button>
        </div>
    </div>
    )
}

export default MyStackAlbum