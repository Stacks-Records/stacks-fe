import Album from './Record'
import { getRecords } from './APICalls'
import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import PropTypes from 'prop-types'
import '../CSS/LandingPage.css'


function LandingPage() {
    const [albums, setAlbums] = useState([])
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('')
    const [filteredAlbums, setFilteredAlbums] = useState([])
    const [filteredSearch, setFilteredSearch] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const records = await getRecords()
                setAlbums(records)
            } catch (error) {
                console.error(error)
                setError(true)
            }
        }
        fetchRecords()
        if(error) {
            return <div>Error: Failed to fetch your records. Please refresh. </div>
        }
        if(!albums) {
            return <div className="error-message">Your records are loading on the turntable...</div>
        }
     }, [])

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
                album.albumName.toLowerCase().includes(query.toLowerCase())
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
                                    {result.albumName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                >
                    <option value="">All Genres</option>
                    <option value="Rock">Rock</option>
                    <option value="Pop">Pop</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Country">Country</option>
                    <option value="Folk">Folk </option>
                    <option value="Jazz">Jazz</option>
                    <option value="Classical">Classical</option>
                </select>
            </div>
            <div className="album-list">
                {filteredAlbums.map(album => (
                    <Album key={album.id} album={album}/>
                ))}
            </div>
        </div>
    )
}

export default LandingPage