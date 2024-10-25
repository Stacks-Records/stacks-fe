import { useNavigate } from 'react-router-dom'
import MyStackContext from '../Context/MyStack'
import '../CSS/Record.css'
import { useContext } from 'react'
function Album({ album, addToStack }) {
    const navigate = useNavigate()
    const {myStack, setMyStack} = useContext(MyStackContext)
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
         return myStack?.some(album => album.id === id)
    };

    return (
        <div className="album-cards" onClick={handleClick}>
            <img src={album.imgURL} alt={`${album.title} cover`} />
            <div className="album-info">
                <h3>{album.artist}</h3>
                <h4>{album.albumName}</h4>
                <p>{album.genre}</p>
                <button className="record-button"
                    onClick={handleAddToStack}
                    disabled={album.isAlbumInStack}
                    >
                    {album.isAlbumInStack ? 'Already Got It' : 'Add To My Stack'}
                </button>
            </div>
        </div>
    )
}

export default Album