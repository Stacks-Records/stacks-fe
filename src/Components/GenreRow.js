import AlbumCarousel from './AlbumCarousel'
import { getAlbumsByGenreName } from './APICalls'
import { useState, useEffect, useRef, useMemo } from 'react'

// One genre's carousel. Albums are fetched lazily the first time the row scrolls
// near the viewport, so the landing page renders cheap shells up front instead of
// mounting every Swiper and loading the whole catalog on first paint.
function GenreRow({ genre, authCode, addToStack }) {
    const sectionRef = useRef(null)
    const [visible, setVisible] = useState(false)
    const [albums, setAlbums] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [rowOrder, setRowOrder] = useState('asc')

    // Sort a copy by album name so the toggle is instant (no refetch) and the
    // original `albums` state stays intact for delete-by-id.
    const sortedAlbums = useMemo(() => {
        const sorted = [...albums].sort((a, b) =>
            (a.albumName ?? '').localeCompare(b.albumName ?? '')
        )
        return rowOrder === 'desc' ? sorted.reverse() : sorted
    }, [albums, rowOrder])

    // Flip `visible` the first time the row nears the viewport, then stop
    // observing — we only need the one-shot trigger to kick off the fetch.
    // rootMargin pre-loads a row just before it scrolls into view.
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true)
                observer.disconnect()
            }
        }, { rootMargin: '300px' })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Fetch once the row is visible. The `active` flag drops a stale response if
    // the component unmounts mid-flight.
    useEffect(() => {
        if (!visible || !authCode) return
        let active = true
        setLoading(true)
        getAlbumsByGenreName(authCode, genre)
            .then(data => {
                if (!active) return
                setAlbums(data)
                setLoaded(true)
            })
            .catch(err => {
                if (!active) return
                console.log(err)
                setError('Could not load this genre.')
            })
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [visible, authCode, genre])

    // Pull a deleted card from this row's local state.
    const handleAlbumDeleted = (albumId) => {
        setAlbums(current => current.filter(a => a.id !== albumId))
    }

    // Once loaded, an emptied-out genre (last album deleted) drops the whole row
    // rather than leaving a headingless gap.
    if (loaded && albums.length === 0) return null

    return (
        <section ref={sectionRef} className="genre-row">
            <div className="genre-row-header">
                <h2 className="genre-heading">{genre}</h2>
                {loaded && albums.length > 1 && (
                    <button
                        type="button"
                        className="row-sort-toggle"
                        onClick={() => setRowOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
                        aria-label={`Sort ${genre} albums`}
                    >
                        {rowOrder === 'asc' ? 'A–Z' : 'Z–A'}
                    </button>
                )}
            </div>
            {error && <p className="error-message">Error: {error}</p>}
            {!loaded && (
                <div className="genre-row-placeholder">
                    {loading && <span className="loading-message">Loading {genre}…</span>}
                </div>
            )}
            {loaded && albums.length > 0 && (
                <AlbumCarousel
                    albums={sortedAlbums}
                    addToStack={addToStack}
                    onAlbumDeleted={handleAlbumDeleted}
                />
            )}
        </section>
    )
}

export default GenreRow
