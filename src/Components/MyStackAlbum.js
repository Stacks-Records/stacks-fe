import {useNavigate} from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getAlbumGenreNames } from '../utils/genres'
import '../CSS/MyStackAlbum.css'

const MyStackAlbum = ({album, handleDelete, dragDisabled = false}) => {
const navigate = useNavigate()
const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
} = useSortable({ id: album.id, disabled: dragDisabled })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleClick = () => {
        navigate(`/${album.id}`)
    }

    const ifTrashStayHere = (e) => {
        e.stopPropagation()
        handleDelete(album)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`my-stack-card${isDragging ? ' dragging' : ''}`}
            onClick={handleClick}
            {...(dragDisabled ? {} : attributes)}
            {...(dragDisabled ? {} : listeners)}
        >
        <img src={album.imgURL} alt={`${album.title} cover`} />
        <div className="my-stack-card-info">
            <h3>{album.artist}</h3>
            <h4>{album.albumName}</h4>
            <p>{getAlbumGenreNames(album.genres, album.genre).join(', ') || 'N/A'}</p>
            <button className="delete-button"onClick={ifTrashStayHere}>Toss This Record</button>
        </div>
    </div>
    )
}

export default MyStackAlbum