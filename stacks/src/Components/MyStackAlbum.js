import '../CSS/MyStackAlbum.css'

const MyStackAlbum = ({album, handleDelete}) => {
    return (
        <div className="album-cards">
        <img src={album.imgURL} alt={`${album.title} cover`} />
        <div className="album-info">
            <h3>{album.artist}</h3>
            <h4>{album.albumName}</h4>
            <p>{album.genre}</p>
            <button className="delete-button"onClick={handleDelete(album.id)}>Toss This Record</button>
        </div>
    </div>
    )
}

export default MyStackAlbum