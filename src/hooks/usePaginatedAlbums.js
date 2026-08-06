import { useState, useEffect, useRef, useCallback } from 'react'
import { getAlbums } from '../Components/APICalls'

// Infinite-scroll pagination shared by the flat "all albums" grid and the
// genre-filtered/sorted browse grid. Resets to page 1 whenever the
// filter/sort/enabled inputs change; loadMore appends subsequent pages as the
// sentinel scrolls into view (same IntersectionObserver approach GenreRow.js
// uses for lazy row loading, but re-armed after each page instead of
// one-shot, since more pages may follow). requestIdRef guards against a
// stale in-flight page landing after the filters changed underneath it.
function usePaginatedAlbums(authCode, { genre, sortBy, order, enabled, pageSize = 40 } = {}) {
    const [albums, setAlbums] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState('')
    const sentinelRef = useRef(null)
    const requestIdRef = useRef(0)

    const genreKey = [].concat(genre ?? []).join(',')

    useEffect(() => {
        const requestId = ++requestIdRef.current
        if (!enabled || !authCode) {
            setAlbums([])
            setPage(1)
            setHasMore(true)
            setError('')
            return
        }
        setLoading(true)
        setError('')
        getAlbums(authCode, { genre, sortBy, order, page: 1, limit: pageSize })
            .then(results => {
                if (requestIdRef.current !== requestId) return
                setAlbums(results)
                setPage(1)
                setHasMore(results.length === pageSize)
            })
            .catch(err => {
                if (requestIdRef.current !== requestId) return
                console.log(err)
                setError('Could not load records.')
            })
            .finally(() => {
                if (requestIdRef.current === requestId) setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, authCode, genreKey, sortBy, order, pageSize])

    const loadMore = useCallback(() => {
        if (!enabled || !authCode || !hasMore || loading || loadingMore) return
        const requestId = requestIdRef.current
        const nextPage = page + 1
        setLoadingMore(true)
        getAlbums(authCode, { genre, sortBy, order, page: nextPage, limit: pageSize })
            .then(results => {
                if (requestIdRef.current !== requestId) return
                setAlbums(current => [...current, ...results])
                setPage(nextPage)
                setHasMore(results.length === pageSize)
            })
            .catch(err => {
                if (requestIdRef.current !== requestId) return
                console.log(err)
                setError('Could not load more records.')
            })
            .finally(() => {
                if (requestIdRef.current === requestId) setLoadingMore(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, authCode, hasMore, loading, loadingMore, page, genreKey, sortBy, order, pageSize])

    // Re-created after every load (loadMore's identity shifts with `page`/
    // `loadingMore`), so the observer re-checks intersection each time — this
    // is what keeps pages loading back-to-back if the sentinel never actually
    // leaves the viewport (short pages, tall screens).
    useEffect(() => {
        const el = sentinelRef.current
        if (!el || !enabled || !hasMore) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) loadMore()
        }, { rootMargin: '300px' })
        observer.observe(el)
        return () => observer.disconnect()
    }, [enabled, hasMore, loadMore])

    const removeAlbum = useCallback((albumId) => {
        setAlbums(current => current.filter(a => a.id !== albumId))
    }, [])

    return { albums, loading, loadingMore, error, hasMore, sentinelRef, removeAlbum }
}

export default usePaginatedAlbums
