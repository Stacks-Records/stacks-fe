import { createContext } from 'react'

// Value shape: the object returned by useSearchSortFilter, same as
// LandingFilterContext, but local-only (not persisted) since it scopes a
// user's personal stack rather than the shared catalog. genreOrder/viewMode
// exist here only for hook-shape symmetry — MyStackPage has no
// carousel/grid split, so no UI wires them up. Don't repurpose them for a
// future manual drag-and-drop reorder feature; that will need its own state.
const StackFilterContext = createContext(null)

export default StackFilterContext
