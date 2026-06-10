import Album from './Record'
import GenreRow from './GenreRow'
import AlbumCarousel from './AlbumCarousel'
import { addStack, getGenres, searchAlbums, getAlbums } from './APICalls'
import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../CSS/LandingPage.css'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuth0 } from "@auth0/auth0-react";

// Single source of truth for the sort dropdown: the <option> list and the
// query mapping. The first entry is the "no sort" default. rollingStoneReview
// requires the backend ALBUM_SORTABLE whitelist to include it.
const SORT_OPTIONS = [
    { value: '', label: 'Sort by…', sortBy: '', order: '' },
    { value: 'name', label: 'Album name (A–Z)', sortBy: 'albumName', order: 'asc' },
    { value: 'sales', label: 'Best selling', sortBy: 'albumsSold', order: 'desc' },
    { value: 'rating', label: 'Highest rated', sortBy: 'rollingStoneReview', order: 'desc' },
]

function LandingPage() {

    const {myStack, setMyStack} = useContext(MyStackContext)
    const {authCode} = useContext(AuthAlbumContext)
    const [genres, setGenres] = useState([])
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState('')
    const [selectedGenre, setSelectedGenre] = useState('')
    const [selectedSort, setSelectedSort] = useState('')
    const [browseResults, setBrowseResults] = useState([])
    const [browseLoading, setBrowseLoading] = useState(false)
    const [browseError, setBrowseError] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {user} = useAuth0()

    const navigate = useNavigate()

    // View precedence: search grid > browse Swiper > canonical carousels.
    const isSearching = search.trim().length > 0
    const isBrowsing = !isSearching && (selectedGenre !== '' || selectedSort !== '')

    // Canonical genres drive the carousels; every genre (incl. user-contributed)
    // populates the filter dropdown.
    const canonicalGenres = useMemo(
        () => genres.filter(g => g.isCanonical).map(g => g.name),
        [genres]
    )
    const allGenreNames = useMemo(() => genres.map(g => g.name), [genres])

    // Fetch only the lightweight list of genres up front; each genre's albums
    // load lazily via its own GenreRow. The response is { name, isCanonical }
    // objects; the string fallback keeps us working through a deploy skew where
    // the API still serves the old bare-string array (treat those as canonical).
    useEffect(() => {
        if (!authCode) return
        setLoading(true)
        getGenres(authCode)
            .then(data => {
                const normalized = data.map(g =>
                    typeof g === 'string' ? { name: g, isCanonical: true } : g
                )
                setGenres(normalized)
            })
            .catch(err => {
                console.log(err)
                setError('Could not load records.')
            })
            .finally(() => setLoading(false))
    }, [authCode])

    // Debounce the raw input so we don't fire a request on every keystroke.
    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(search.trim()), 300)
        return () => clearTimeout(id)
    }, [search])

    // Server-side search across the whole catalog (matches album name + artist).
    // The `active` flag drops stale responses if the query changes mid-flight.
    useEffect(() => {
        if (!debouncedSearch || !authCode) {
            setSearchResults([])
            setSearchError('')
            return
        }
        let active = true
        setSearchLoading(true)
        setSearchError('')
        searchAlbums(authCode, debouncedSearch)
            .then(results => { if (active) setSearchResults(results) })
            .catch(err => {
                if (!active) return
                console.log(err)
                setSearchError('Could not search records.')
            })
            .finally(() => { if (active) setSearchLoading(false) })
        return () => { active = false }
    }, [debouncedSearch, authCode])

    // Combined genre-filter + sort for the browse view. Tears down (clears
    // results) whenever browsing stops — including when a search takes over.
    useEffect(() => {
        if (!isBrowsing || !authCode) {
            setBrowseResults([])
            setBrowseError('')
            return
        }
        const opt = SORT_OPTIONS.find(o => o.value === selectedSort) || SORT_OPTIONS[0]
        let active = true
        setBrowseLoading(true)
        setBrowseError('')
        getAlbums(authCode, { genre: selectedGenre, sortBy: opt.sortBy, order: opt.order })
            .then(results => { if (active) setBrowseResults(results) })
            .catch(err => {
                if (!active) return
                console.log(err)
                setBrowseError('Could not load records.')
            })
            .finally(() => { if (active) setBrowseLoading(false) })
        return () => { active = false }
    }, [isBrowsing, selectedGenre, selectedSort, authCode])

    const addToStack = (album) => {
        const {email} = user
        addStack(email, album, authCode)
            .catch(err => console.log(err))
        setMyStack([...myStack, album])
        navigate('/my-stack')
    }

    // Search and browse results are server-sourced, so a deleted card has to be
    // pulled from local state here. Genre rows manage their own deletions.
    const handleSearchAlbumDeleted = (albumId) => {
        setSearchResults(results => results.filter(a => a.id !== albumId))
    }

    const handleBrowseAlbumDeleted = (albumId) => {
        setBrowseResults(results => results.filter(a => a.id !== albumId))
    }

    const sortLabel = SORT_OPTIONS.find(o => o.value === selectedSort)?.label

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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="genre-select"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    aria-label="Filter by genre"
                >
                    <option value="">All genres</option>
                    {allGenreNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <select
                    className="sort-select"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    aria-label="Sort albums"
                >
                    {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>

            {isSearching && (
                <div className="search-view">
                    {searchLoading && <p className="loading-message">Searching the crates...</p>}
                    {searchError && <p className="error-message">Error: {searchError}</p>}
                    {!searchLoading && !searchError && debouncedSearch && searchResults.length === 0 && (
                        <p className="loading-message">No records match "{debouncedSearch}".</p>
                    )}
                    <div className="search-results-grid">
                        {searchResults.map(album => (
                            <Album key={album.id} album={album} addToStack={addToStack} onAlbumDeleted={handleSearchAlbumDeleted}/>
                        ))}
                    </div>
                </div>
            )}

            {isBrowsing && (
                <div className="browse-view">
                    <h2 className="browse-heading">
                        {selectedGenre || 'All genres'}
                        {sortLabel && selectedSort && ` · ${sortLabel}`}
                    </h2>
                    {browseLoading && <p className="loading-message">Loading records…</p>}
                    {browseError && <p className="error-message">Error: {browseError}</p>}
                    {!browseLoading && !browseError && browseResults.length === 0 && (
                        <p className="loading-message">No records match this selection.</p>
                    )}
                    {browseResults.length > 0 && (
                        <AlbumCarousel
                            albums={browseResults}
                            addToStack={addToStack}
                            onAlbumDeleted={handleBrowseAlbumDeleted}
                        />
                    )}
                </div>
            )}

            {/* Kept mounted (just hidden) while searching/browsing so already-loaded
                rows don't refetch when those views are dismissed. */}
            <div className="genre-rows" style={{ display: (isSearching || isBrowsing) ? 'none' : 'contents' }}>
                {!loading && canonicalGenres.length === 0 && (
                    <p className="loading-message">No records to display.</p>
                )}
                {canonicalGenres.map(genre => (
                    <GenreRow
                        key={genre}
                        genre={genre}
                        authCode={authCode}
                        addToStack={addToStack}
                    />
                ))}
            </div>
        </div>
    )
}

export default LandingPage
