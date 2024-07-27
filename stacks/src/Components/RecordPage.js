import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getRecords } from './APICalls'
import '../CSS/RecordPage.css'

function RecordPage() {
    const { albumId } = useParams()
    const [album, setAlbum] = useState(null)


    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const records = await getRecords()
                const album = records.find(record => record.id === albumId)
                setAlbum(album)
            } catch (error) {
                console.error(error)
            }
        }
        fetchRecord()
    }, [albumId])

    if (!album) {
        return <div className="loading-prompt">Loading your record...</div>
    }

    return (
        <div className="record-details">
            <img src={album.imgURL} alt={`${album.albumName} cover`}/>
            <h1>{album.albumName}</h1>
            <h2>{album.artist}</h2>
            <p><strong>Release Date:</strong>{album.releaseDate}</p>
            <p><strong>Genre:</strong>{album.genre}</p>
            <p><strong>Band Members:</strong>{album.bandMembers.join(', ')}</p>
            <p><strong>Label:</strong>{album.label}</p>
            <p><strong>Rolling Stone Review:</strong>{album.rollingStoneReview}</p>
            <a href={album.youTubeAlbumURL} target="_blank" rel="noopener noreferrer">Listen</a>
            <p><strong>Albums Sold to Date:</strong>{album.albumsSold}</p>
        </div> 
    )
}

export default RecordPage