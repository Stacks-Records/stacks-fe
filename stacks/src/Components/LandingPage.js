import Album from './Record'
import { getRecords } from './APICalls'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStack } from './MyStack'
import PropTypes from 'prop-types'
import '../CSS/LandingPage.css'


function LandingPage({records}) {
    const [albums, setAlbums] = useState(records)
    const [search, setSearch] = useState('')
    const [genre, setGenre] = useState('')
    const [filteredAlbums, setFilteredAlbums] = useState(records)
    const [filteredSearch, setFilteredSearch] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [myStack, setMyStack] = useStack()
    const navigate = useNavigate()

    const addToStack = (album) => {
        setMyStack([...myStack, album])
        navigate('/my-stack')
    }


    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true)
            try {
                const records = await getRecords()
                setAlbums(records)
                setError('')
            } catch (error) {
                console.error(error)
                setError(error.message)
            }
            setLoading(false)
        }
        fetchRecords()
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
                    <label for="genre-select">Select Your Genre:</label>
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
                    <Album key={album.id} album={album} addToStack={addToStack}/>
                ))}
            </div>
        </div>
    )
}

LandingPage.propTypes = {
    records: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

export default LandingPage