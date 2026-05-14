import Album from './Record'
import { addStack, getGenres } from './APICalls'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import '../CSS/LandingPage.css'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuth0 } from "@auth0/auth0-react";

function LandingPage() {

    const {myStack, setMyStack} = useContext(MyStackContext)
    const {albums} = useContext(AuthAlbumContext)
    const {authCode} = useContext(AuthAlbumContext)
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])
    const [filteredAlbums, setFilteredAlbums] = useState(albums)
    const [filteredSearch, setFilteredSearch] = useState([])
    const [error] = useState('')
    const [loading] = useState(false)
    const {user} = useAuth0()

    const navigate = useNavigate()

    useEffect(() => {
        if (!authCode) return
        getGenres(authCode)
            .then(setGenres)
            .catch(err => console.log(err))
    }, [authCode])
    const addToStack = (album) => {
        const {email} = user
        addStack(email, album, authCode)
            .catch(err => console.log(err))
        setMyStack([...myStack, album])
        navigate('/my-stack')
    }

    useEffect(() => {
        const filterAlbums = () => {
            let filtered = albums
            if (search) {
                filtered = filtered.filter(album =>
                    album.albumName.toLowerCase().includes(search.toLowerCase())
                )
            }
            if (genre) {
                filtered = filtered.filter(album =>
                    album.genre.toLowerCase() === genre.toLowerCase()
                )
            }
            setFilteredAlbums(filtered)
        }
        filterAlbums()
    }, [search, genre, albums])

    const handleSearch = (e) => {
        const query = e.target.value
        setSearch(query)

        if (query) {
            const results = albums.filter(album =>
                album.artist.toLowerCase().includes(query.toLowerCase())
            )
            setFilteredSearch(results)
        } else {
            setFilteredSearch([])
        }
    }

    const handleSelectResult = (result) => {
        setSearch(result.albumName)
        setFilteredSearch([])
    }


    return (
        <div className="landing-page">
            {loading && <p className="loading-message">Loading up your records on the turntable... </p>}
            {error && <p className="error-message">Error: {error}</p>}
            <div className="filters">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="What would you like to listen to?"
                        value={search}
                        onChange={handleSearch}
                    />
                    {filteredSearch.length > 0 && (
                        <ul className="search-results">
                            {filteredSearch.map(result => (
                                <li key={result.id} onClick={() => handleSelectResult(result)}>
                                    {result.artist}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                >
                    <option value="">Select Your Genre</option>
                    {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
            <div className="album-list">
                {filteredAlbums.map(album => (            
                    <Album key={album.id} album={album} addToStack={addToStack}/>
                ))}
            </div>
        </div>
    )
}

export default LandingPage