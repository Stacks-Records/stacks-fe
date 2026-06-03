import Album from './Record'
import { addStack, getAlbumsByGenre } from './APICalls'
import { useState, useEffect, useContext, useMemo } from 'react'
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
    const [filteredSearch, setFilteredSearch] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {user} = useAuth0()

    const navigate = useNavigate()

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

    const addToStack = (album) => {
        const {email} = user
        addStack(email, album, authCode)
            .catch(err => console.log(err))
        setMyStack([...myStack, album])
        navigate('/my-stack')
    }

    // Rows are sourced from the server, so a deleted card has to be pulled from
    // local state here. Empty genres drop out so we don't render headingless rows.
    const handleAlbumDeleted = (albumId) => {
        setGenreGroups(groups =>
            groups
                .map(g => ({ ...g, albums: g.albums.filter(a => a.id !== albumId) }))
                .filter(g => g.albums.length > 0)
        )
    }

    // Flat list backing the artist autocomplete below the search box.
    const allAlbums = useMemo(
        () => genreGroups.flatMap(g => g.albums),
        [genreGroups]
    )

    // While searching, filter each genre row by album name and hide empty rows.
    const visibleGroups = useMemo(() => {
        if (!search) return genreGroups
        const query = search.toLowerCase()
        return genreGroups
            .map(g => ({
                ...g,
                albums: g.albums.filter(a => a.albumName.toLowerCase().includes(query))
            }))
            .filter(g => g.albums.length > 0)
    }, [search, genreGroups])

    const handleSearch = (e) => {
        const query = e.target.value
        setSearch(query)

        if (query) {
            const results = allAlbums.filter(album =>
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
            </div>

            {!loading && visibleGroups.length === 0 && (
                <p className="loading-message">No records to display.</p>
            )}

            {visibleGroups.map(group => (
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
        </div>
    )
}

export default LandingPage
