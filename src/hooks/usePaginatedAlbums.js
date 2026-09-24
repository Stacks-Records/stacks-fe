import { useState, useEffect, useRef, useCallback } from 'react'
import { getAlbums } from '../Components/APICalls'

// Plain array-splice reorder, kept local so this fetch/state hook doesn't
// need a dnd-kit dependency (dnd-kit's own arrayMove is imported instead by
// the UI callers that already depend on it, e.g. MyStackPage's onDragEnd).
function moveItem(arr, from, to) {
    const next = arr.slice()
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    return next
}

// Infinite-scroll pagination shared by the flat "all albums" grid, the
// genre-filtered/sorted browse grid, and (via `fetcher`) the personal-stack
// grid. Resets to page 1 whenever the filter/sort/enabled inputs change;
// loadMore appends subsequent pages as the sentinel scrolls into view (same
// IntersectionObserver approach GenreRow.js uses for lazy row loading, but
// re-armed after each page instead of one-shot, since more pages may
// follow). requestIdRef guards against a stale in-flight page landing after
// the filters changed underneath it, or after the component unmounts
// entirely (e.g. a route change away from the page mid-fetch) — the cleanup
// below bumps it so an in-flight response from a now-gone instance is a
// no-op instead of calling setState on stale closures. `fetcher` defaults to
// getAlbums (the catalog); pass getStackAlbums to page through the user's
// stack instead.
function usePaginatedAlbums(authCode, { genre, sortBy, order, search, enabled, pageSize = 40, fetcher = getAlbums } = {}) {
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
        // Guards a response landing after this effect run is superseded —
        // either by a dep change (cleanup runs before the next run's fetch)
        // or, since there's no next run in that case, by unmount.
        let cancelled = false
        if (!enabled || !authCode) {
            setAlbums([])
            setPage(1)
            setHasMore(true)
            setError('')
            return
        }
        setLoading(true)
        setError('')
        fetcher(authCode, { search, genre, sortBy, order, page: 1, limit: pageSize })
            .then(results => {
                if (cancelled || requestIdRef.current !== requestId) return
                setAlbums(results)
                setPage(1)
                setHasMore(results.length === pageSize)
            })
            .catch(err => {
                if (cancelled || requestIdRef.current !== requestId) return
                console.log(err)
                setError('Could not load records.')
            })
            .finally(() => {
                if (!cancelled && requestIdRef.current === requestId) setLoading(false)
            })
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, authCode, genreKey, sortBy, order, search, pageSize, fetcher])

    const loadMore = useCallback(() => {
        if (!enabled || !authCode || !hasMore || loading || loadingMore) return
        const requestId = requestIdRef.current
        const nextPage = page + 1
        setLoadingMore(true)
        fetcher(authCode, { search, genre, sortBy, order, page: nextPage, limit: pageSize })
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
    }, [enabled, authCode, hasMore, loading, loadingMore, page, genreKey, sortBy, order, search, pageSize, fetcher])

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

    const reorderAlbums = useCallback((oldIndex, newIndex) => {
        setAlbums(current => moveItem(current, oldIndex, newIndex))
    }, [])

    const addAlbum = useCallback((album) => {
        setAlbums(current => current.some(a => a.id === album.id) ? current : [...current, album])
    }, [])

    return { albums, loading, loadingMore, error, hasMore, sentinelRef, removeAlbum, reorderAlbums, addAlbum }
}

export default usePaginatedAlbums
