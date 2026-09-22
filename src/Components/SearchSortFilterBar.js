import Select from 'react-select'
import '../CSS/SearchSortFilterBar.css'

// Fully presentational: props in, callbacks out. Reused for both the full
// catalog (LandingPage, variant="landing") and the user's personal stack
// (MyStackPage, variant="stack") — the genre-order and view-mode toggles
// only render for the "landing" variant per that page's carousel/grid split,
// which MyStackPage doesn't have.
function SearchSortFilterBar({
    search, onSearchChange, searchPlaceholder,
    genreOptions, selectedGenres, onGenresChange,
    selectedSort, onSortChange, sortOptions,
    variant,
    genreOrder, onGenreOrderToggle,
    viewMode, onViewModeToggle,
}) {
    return (
        <div className="filters">
            <div className="search-container">
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <Select
                inputId="genre-filter-select"
                classNamePrefix="genre-select"
                aria-label="Filter by genre"
                isClearable
                isMulti
                placeholder="Genre multi-select..."
                value={selectedGenres.map(name => ({ value: name, label: name }))}
                onChange={(selected) => onGenresChange((selected ?? []).map(o => o.value))}
                options={genreOptions.map(name => ({ value: name, label: name }))}
            />
            <select
                className="sort-select"
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort albums"
            >
                {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {variant === 'landing' && (
                <div className="view-toggles">
                    {viewMode === 'carousel' && (
                        <button
                            type="button"
                            className={`switch-toggle genre-order-toggle ${genreOrder === 'desc' ? 'is-on' : ''}`}
                            onClick={onGenreOrderToggle}
                            aria-pressed={genreOrder === 'desc'}
                            aria-label="Flip genre order"
                        >
                            <span className="switch-toggle-option">Genres A–Z</span>
                            <span className="switch-toggle-track"><span className="switch-toggle-thumb" /></span>
                            <span className="switch-toggle-option">Z-A</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className={`switch-toggle view-mode-toggle ${viewMode === 'grid' ? 'is-on' : ''}`}
                        onClick={onViewModeToggle}
                        aria-pressed={viewMode === 'grid'}
                        aria-label="Toggle grid or carousel view"
                    >
                        <span className="switch-toggle-option">Carousel</span>
                        <span className="switch-toggle-track"><span className="switch-toggle-thumb" /></span>
                        <span className="switch-toggle-option">Grid</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default SearchSortFilterBar
