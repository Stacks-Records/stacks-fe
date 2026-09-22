import Album from './Record'
import GenreRow from './GenreRow'
import AlbumCarousel from './AlbumCarousel'
import { addStack, searchAlbums, getAlbums } from './APICalls'
import { useState, useEffect, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../CSS/LandingPage.css'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import GenreContext from '../Context/GenreContext'
import LandingFilterContext from '../Context/LandingFilterContext'
import { useAuth0 } from "@auth0/auth0-react";
import usePaginatedAlbums from '../hooks/usePaginatedAlbums'

function LandingPage() {

    const {myStack, setMyStack} = useContext(MyStackContext)
    const {authCode} = useContext(AuthAlbumContext)
    const { genres } = useContext(GenreContext)
    const {
        search, debouncedSearch, selectedGenres, selectedSort, sortOpt, genreOrder, viewMode,
    } = useContext(LandingFilterContext)
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState('')
    // Only feeds the browse Swiper (non-grid). The grid rendering of browse
    // results is paginated instead, via browseGrid below.
    const [browseResults, setBrowseResults] = useState([])
    const [browseLoading, setBrowseLoading] = useState(false)
    const [browseError, setBrowseError] = useState('')
    const {user} = useAuth0()

    const navigate = useNavigate()

    // View precedence: search grid > browse Swiper > canonical carousels.
    const isSearching = search.trim().length > 0
    const isBrowsing = !isSearching && (selectedGenres.length > 0 || selectedSort !== '')
    // Browsing splits by viewMode: the grid rendering is paginated (browseGrid,
    // below); the Swiper rendering keeps the original single-fetch effect.
    const isBrowsingGrid = isBrowsing && viewMode === 'grid'
    const isBrowsingCarousel = isBrowsing && viewMode !== 'grid'

    // Canonical genres drive the carousels; the carousels sort alphabetically
    // and flip with the genre-order toggle.
    const canonicalGenres = useMemo(() => {
        const names = genres
            .filter(g => g.isCanonical)
            .map(g => g.name)
            .sort((a, b) => a.localeCompare(b))
        return genreOrder === 'desc' ? names.reverse() : names
    }, [genres, genreOrder])

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

    // Combined genre-filter + sort for the browse Swiper. Tears down (clears
    // results) whenever the carousel rendering of browse stops — including
    // when a search takes over or the view flips to grid (paginated separately
    // by browseGrid below).
    useEffect(() => {
        if (!isBrowsingCarousel || !authCode) {
            setBrowseResults([])
            setBrowseError('')
            return
        }
        let active = true
        setBrowseLoading(true)
        setBrowseError('')
        getAlbums(authCode, { genre: selectedGenres, sortBy: sortOpt.sortBy, order: sortOpt.order })
            .then(results => { if (active) setBrowseResults(results) })
            .catch(err => {
                if (!active) return
                console.log(err)
                setBrowseError('Could not load records.')
            })
            .finally(() => { if (active) setBrowseLoading(false) })
        return () => { active = false }
    }, [isBrowsingCarousel, selectedGenres, sortOpt, authCode])

    // Grid mode's default (unfiltered) view needs a flat, paginated fetch of the
    // catalog, since the carousel default view instead loads albums per-genre via
    // GenreRow. Only enabled while not searching/browsing so the common carousel
    // path never pays for it.
    const flatGrid = usePaginatedAlbums(authCode, {
        enabled: viewMode === 'grid' && !isSearching && !isBrowsing,
    })

    // Genre-filtered/sorted grid rendering of the browse view, paginated
    // separately from the Swiper rendering (browseResults above).
    const browseGrid = usePaginatedAlbums(authCode, {
        genre: selectedGenres,
        sortBy: sortOpt.sortBy,
        order: sortOpt.order,
        enabled: isBrowsingGrid,
    })

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

    const sortLabel = sortOpt.label

    return (
        <div className="landing-page">
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
                        {selectedGenres.length > 0 ? selectedGenres.join(', ') : 'All genres'}
                        {sortLabel && selectedSort && ` · ${sortLabel}`}
                    </h2>
                    {viewMode === 'grid' ? (
                        <>
                            {browseGrid.loading && <p className="loading-message">Loading records…</p>}
                            {browseGrid.error && <p className="error-message">Error: {browseGrid.error}</p>}
                            {!browseGrid.loading && !browseGrid.error && browseGrid.albums.length === 0 && (
                                <p className="loading-message">No records match this selection.</p>
                            )}
                            {browseGrid.albums.length > 0 && (
                                <div className="search-results-grid">
                                    {browseGrid.albums.map(album => (
                                        <Album key={album.id} album={album} addToStack={addToStack} onAlbumDeleted={browseGrid.removeAlbum}/>
                                    ))}
                                </div>
                            )}
                            {browseGrid.loadingMore && <p className="loading-message grid-load-more">Loading more…</p>}
                            {browseGrid.hasMore && <div ref={browseGrid.sentinelRef} className="grid-sentinel" />}
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            )}

            {/* Kept mounted (just hidden) while searching/browsing/grid-viewing so
                already-loaded rows don't refetch when those views are dismissed. */}
            <div className="genre-rows" style={{ display: (isSearching || isBrowsing || viewMode === 'grid') ? 'none' : 'contents' }}>
                {canonicalGenres.length === 0 && (
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

            {!isSearching && !isBrowsing && viewMode === 'grid' && (
                <div className="grid-view">
                    {flatGrid.loading && <p className="loading-message">Loading records…</p>}
                    {flatGrid.error && <p className="error-message">Error: {flatGrid.error}</p>}
                    {!flatGrid.loading && !flatGrid.error && flatGrid.albums.length === 0 && (
                        <p className="loading-message">No records to display.</p>
                    )}
                    <div className="search-results-grid">
                        {flatGrid.albums.map(album => (
                            <Album key={album.id} album={album} addToStack={addToStack} onAlbumDeleted={flatGrid.removeAlbum}/>
                        ))}
                    </div>
                    {flatGrid.loadingMore && <p className="loading-message grid-load-more">Loading more…</p>}
                    {flatGrid.hasMore && <div ref={flatGrid.sentinelRef} className="grid-sentinel" />}
                </div>
            )}
        </div>
    )
}

export default LandingPage
