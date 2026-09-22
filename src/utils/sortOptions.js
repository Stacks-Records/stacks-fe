// Single source of truth for the sort dropdown: the <option> list and the
// query mapping. The first entry is the "no sort" default. rollingStoneReview
// requires the backend ALBUM_SORTABLE whitelist to include it.
export const SORT_OPTIONS = [
    { value: '', label: 'Sort by…', sortBy: '', order: '' },
    { value: 'name-asc', label: 'Album name (A–Z)', sortBy: 'albumName', order: 'asc' },
    { value: 'name-desc', label: 'Album name (Z–A)', sortBy: 'albumName', order: 'desc' },
    { value: 'sales', label: 'Best selling', sortBy: 'albumsSold', order: 'desc' },
    { value: 'rating', label: 'Highest rated', sortBy: 'rollingStoneReview', order: 'desc' },
]
