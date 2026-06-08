import MyStackContext from '../Context/MyStack'
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/RecordPage.css';
import { useContext, useState, useEffect } from 'react';
import AuthAlbumContext from '../Context/AuthAlbumContext';
import { useAuthorization } from '../Context/AuthorizationContext';
import { PERMISSIONS } from '../utils/permissions';
import { getYouTubeVideoID } from '../utils/validation';
import { deleteAlbum, getRecordById } from './APICalls';

const RecordPage = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { myStack, setMyStack } = useContext(MyStackContext)
    const { albums, setAlbums, authCode } = useContext(AuthAlbumContext)
    const { checkAction } = useAuthorization()

    // Prefer the in-memory list, but fall back to a by-id fetch so deep links and
    // hard reloads (where `albums` hasn't loaded yet) still resolve the record.
    // Re-runs on id/context change since the route reuses this component instance.
    const cached = [...albums, ...myStack].find(r => r.id === id) || null
    const [record, setRecord] = useState(cached)
    const [loading, setLoading] = useState(!cached)

    useEffect(() => {
        if (cached) { setRecord(cached); setLoading(false); return }
        let active = true
        setRecord(null)
        setLoading(true)
        getRecordById(id, authCode)
            .then(r => { if (active) { setRecord(r); setLoading(false) } })
            .catch(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [id, cached, authCode])

    if (loading) {
        return <p>Loading…</p>;
    }

    if (!record) {
        return <p>Record not found.</p>;
    }

    const {
        albumName = 'N/A',
        artist = 'N/A',
        releaseDate = 'N/A',
        genre = 'N/A',
        bandMembers = [],
        label = 'N/A',
        isBandTogether = false,
        rollingStoneReview = 'N/A',
        youTubeAlbumURL = '',
        imgURL = '',
        albumsSold = 0
    } = record;

    const videoID = getYouTubeVideoID(youTubeAlbumURL)

    const addToStack = (album) => {
        setMyStack([...myStack, album])
        navigate('/my-stack')
    }

    const isAlbumInStack = (id) => {
        return myStack.some(album => album.id === id)
    }

    const handleEdit = () => {
        navigate('/add-stack', { state: { albumToEdit: record } })
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${albumName}"? This cannot be undone.`)) return
        try {
            await deleteAlbum(record.id, authCode)
            setAlbums(albums.filter(a => a.id !== record.id))
            navigate('/landing')
        } catch (error) {
            console.error('Failed to delete album:', error.message)
            alert('Could not delete album. Please try again.')
        }
    }

    const canEdit = checkAction(PERMISSIONS.EDIT_ALBUM, record.created_by)
    const canDelete = checkAction(PERMISSIONS.DELETE_ALBUM, record.created_by)

    return (
        <div className="record-page">
            {youTubeAlbumURL && (
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoID}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}
            <div className="buttons-container">
                <button onClick={() => addToStack(record)}
                    disabled={isAlbumInStack(record.id)}
                >
                    {isAlbumInStack(record.id) ? 'Already Got It' : 'Add To My Stack'}
                </button>
                {canEdit && (
                    <button onClick={handleEdit}>Edit Album</button>
                )}
                {canDelete && (
                    <button onClick={handleDelete} className="delete-btn">Delete Album</button>
                )}
            </div>
            <div className="image-container">
                <img src={imgURL} alt={`${albumName} cover`} />
                <div className="album-info">
                    <h1>{albumName}</h1>
                    <h2>{artist}</h2>
                    <p><strong>Release Date:</strong> {releaseDate}</p>
                    <p><strong>Genre:</strong> {genre}</p>
                    <p><strong>Band Members:</strong> {Array.isArray(bandMembers) ? bandMembers.join(', ') : (bandMembers || 'N/A')}</p>
                    <p><strong>Label:</strong> {label}</p>
                    <p><strong>Band Status:</strong> {isBandTogether ? 'Together' : 'Disbanded'}</p>
                    <p><strong>Rolling Stone Review:</strong> {rollingStoneReview}</p>
                    <p><strong>Albums Sold:</strong> {Number(albumsSold || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default RecordPage;
