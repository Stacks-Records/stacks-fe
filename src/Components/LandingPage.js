import Album from './Record'
import { addStack, getAlbumsByGenre, searchAlbums } from './APICalls'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import '../CSS/LandingPage.css'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import { useAuth0 } from "@auth0/auth0-react";

function LandingPage() {

    const {myStack, setMyStack} = useContext(MyStackContext)
    const {authCode} = useContext(AuthAlbumContext)
    const [genreGroups, setGenreGroups] = useState([])
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchError, setSearchError] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {user} = useAuth0()

    const navigate = useNavigate()

    // While searching we hide the genre carousels and show a flat results grid.
    const isSearching = search.trim().length > 0

    useEffect(() => {
        if (!authCode) return
        setLoading(true)
        getAlbumsByGenre(authCode)
            .then(setGenreGroups)
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

    const addToStack = (album) => {
        const {email} = user
        addStack(email, album, authCode)
            .catch(err => console.log(err))
        setMyStack([...myStack, album])
        navigate('/my-stack')
    }

    // Rows and search results are sourced from the server, so a deleted card has
    // to be pulled from local state in both places. Empty genres drop out so we
    // don't render headingless rows.
    const handleAlbumDeleted = (albumId) => {
        setGenreGroups(groups =>
            groups
                .map(g => ({ ...g, albums: g.albums.filter(a => a.id !== albumId) }))
                .filter(g => g.albums.length > 0)
        )
        setSearchResults(results => results.filter(a => a.id !== albumId))
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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isSearching ? (
                <div className="search-view">
                    {searchLoading && <p className="loading-message">Searching the crates...</p>}
                    {searchError && <p className="error-message">Error: {searchError}</p>}
                    {!searchLoading && !searchError && debouncedSearch && searchResults.length === 0 && (
                        <p className="loading-message">No records match "{debouncedSearch}".</p>
                    )}
                    <div className="search-results-grid">
                        {searchResults.map(album => (
                            <Album key={album.id} album={album} addToStack={addToStack} onAlbumDeleted={handleAlbumDeleted}/>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {!loading && genreGroups.length === 0 && (
                        <p className="loading-message">No records to display.</p>
                    )}

                    {genreGroups.map(group => (
                        <section key={group.genre} className="genre-row">
                            <h2 className="genre-heading">{group.genre}</h2>
                            <Swiper
                                modules={[EffectCoverflow, Navigation, Keyboard]}
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView="auto"
                                keyboard={{ enabled: true }}
                                navigation={true}
                                coverflowEffect={{
                                    rotate: 80,
                                    stretch: 0,
                                    depth: 150,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                className="album-carousel"
                            >
                                {group.albums.map(album => (
                                    <SwiperSlide key={album.id} className="album-slide">
                                        <Album album={album} addToStack={addToStack} onAlbumDeleted={handleAlbumDeleted}/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </section>
                    ))}
                </>
            )}
        </div>
    )
}

export default LandingPage
