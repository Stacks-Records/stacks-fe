import { createContext } from 'react'

// Value shape: the object returned by useSearchSortFilter (search, setSearch,
// debouncedSearch, selectedGenres, setSelectedGenres, selectedSort,
// setSelectedSort, sortOpt, genreOrder, setGenreOrder, viewMode, setViewMode).
// Backed by useUserPreferences in App.js, so these choices persist per-user.
const LandingFilterContext = createContext(null)

export default LandingFilterContext
