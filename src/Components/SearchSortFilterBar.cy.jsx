import SearchSortFilterBar from './SearchSortFilterBar'

const sortOptions = [
    { value: '', label: 'Sort by…', sortBy: '', order: '' },
    { value: 'name-asc', label: 'Album name (A–Z)', sortBy: 'albumName', order: 'asc' },
]

function mountBar(overrides = {}) {
    const props = {
        search: '',
        onSearchChange: cy.stub().as('onSearchChange'),
        searchPlaceholder: 'What would you like to listen to?',
        genreOptions: ['Rock', 'Pop'],
        selectedGenres: [],
        onGenresChange: cy.stub().as('onGenresChange'),
        selectedSort: '',
        onSortChange: cy.stub().as('onSortChange'),
        sortOptions,
        variant: 'landing',
        genreOrder: 'asc',
        onGenreOrderToggle: cy.stub().as('onGenreOrderToggle'),
        viewMode: 'carousel',
        onViewModeToggle: cy.stub().as('onViewModeToggle'),
        ...overrides,
    }
    cy.mount(<SearchSortFilterBar {...props} />)
    return props
}

describe('SearchSortFilterBar', () => {
    it('renders the search input, genre select, and sort select for any variant', () => {
        mountBar({ variant: 'stack' })
        cy.get('.search-container input[type="text"]').should('have.attr', 'placeholder', 'What would you like to listen to?')
        cy.get('#genre-filter-select').should('exist')
        cy.get('.sort-select option').should('have.length', sortOptions.length)
    })

    it('fires onSearchChange as the user types', () => {
        mountBar()
        cy.get('.search-container input[type="text"]').type('Floyd')
        cy.get('@onSearchChange').should('have.been.called')
    })

    it('fires onSortChange when a sort option is selected', () => {
        mountBar()
        cy.get('.sort-select').select('Album name (A–Z)')
        cy.get('@onSortChange').should('have.been.calledWith', 'name-asc')
    })

    it('renders the genre-order and view-mode toggles for the landing variant', () => {
        mountBar({ variant: 'landing' })
        cy.get('.view-mode-toggle').should('exist')
        cy.get('.genre-order-toggle').should('exist')
    })

    it('fires onViewModeToggle when the view-mode toggle is clicked', () => {
        mountBar({ variant: 'landing' })
        cy.get('.view-mode-toggle').click()
        cy.get('@onViewModeToggle').should('have.been.called')
    })

    it('does not render the genre-order or view-mode toggles for the stack variant', () => {
        mountBar({ variant: 'stack' })
        cy.get('.view-mode-toggle').should('not.exist')
        cy.get('.genre-order-toggle').should('not.exist')
    })
})
