import { useState, useEffect, useMemo } from 'react'
import { SORT_OPTIONS } from '../utils/sortOptions'

// Shared state behind the search/sort/genre-filter bar, reusable across
// pages that each filter a different dataset (catalog vs. personal stack).
// `search`/`debouncedSearch` are always local/ephemeral (never persisted).
// `selectedGenres`/`selectedSort`/`genreOrder`/`viewMode` are backed by
// `external.preferences`/`external.setPreferences` when the caller wants
// them persisted (LandingPage, via useUserPreferences) or plain local state
// otherwise (MyStackPage, no persistence).
function useSearchSortFilter({ defaults, external } = {}) {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [localPreferences, setLocalPreferences] = useState(defaults)

    const preferences = external ? external.preferences : localPreferences
    const setPreferences = external ? external.setPreferences : (updates) =>
        setLocalPreferences(prev => ({ ...prev, ...updates }))

    const { selectedGenres, selectedSort, genreOrder, viewMode } = preferences
    const setSelectedGenres = (value) => setPreferences({ selectedGenres: value })
    const setSelectedSort = (value) => setPreferences({ selectedSort: value })
    const setGenreOrder = (value) => setPreferences({ genreOrder: value })
    const setViewMode = (value) => setPreferences({ viewMode: value })

    // Debounce the raw input so callers don't fire a request on every keystroke.
    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(search.trim()), 300)
        return () => clearTimeout(id)
    }, [search])

    const sortOpt = useMemo(
        () => SORT_OPTIONS.find(o => o.value === selectedSort) || SORT_OPTIONS[0],
        [selectedSort]
    )

    return {
        search, setSearch, debouncedSearch,
        selectedGenres, setSelectedGenres,
        selectedSort, setSelectedSort, sortOpt,
        genreOrder, setGenreOrder,
        viewMode, setViewMode,
    }
}

export default useSearchSortFilter
