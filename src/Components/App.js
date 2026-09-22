import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuthToken } from '../Context/AuthTokenContext'
import LoginPage from './LoginPage'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStackPage from './MyStackPage'
import AdminUsersPage from './AdminUsersPage'
import '../CSS/App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthorizationProvider } from '../Context/AuthorizationContext'
import MyStackContext from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'
import GenreContext from '../Context/GenreContext'
import LandingFilterContext from '../Context/LandingFilterContext'
import StackFilterContext from '../Context/StackFilterContext'
import ParticlesBackground from './ParticlesBackground'
import { getRecords, getStack, getGenres } from './APICalls'
import useSearchSortFilter from '../hooks/useSearchSortFilter'
import useUserPreferences from '../hooks/useUserPreferences'

// Module-level so it's a stable reference across renders (avoids re-firing
// the preferences fetch effect on every App render).
const LANDING_DEFAULTS = { selectedGenres: [], selectedSort: '', genreOrder: 'asc', viewMode: 'carousel' }
// genreOrder/viewMode are unused for the stack filter today — retained only
// for hook-shape symmetry with LANDING_DEFAULTS.
const STACK_DEFAULTS = { selectedGenres: [], selectedSort: '', genreOrder: 'asc', viewMode: 'carousel' }

function App() {
  const { isAuthenticated, user } = useAuth0()
  const userEmail = user?.email
  const { token: authCode } = useAuthToken()
  const [albums, setAlbums] = useState([])
  const [myStack, setMyStack] = useState([])
  const [genres, setGenres] = useState([])

  // Load records + the user's stack once the shared token is ready. Owning
  // this here (instead of in LoginPage) keeps every page reload-safe. Gated
  // on authCode's own truthiness (it's empty until AuthTokenContext confirms
  // a real token — see that file) rather than an isLoading flag, so a
  // redundant upstream fetch resolving to the same token can't re-fire this.
  useEffect(() => {
    if (!authCode || !isAuthenticated || !userEmail) return
    const loadData = async () => {
      try {
        const records = await getRecords(authCode)
        setAlbums(records)
        const stack = await getStack(userEmail, authCode)
        setMyStack(stack[0]?.mystack ?? [])
        // The response is { name, isCanonical } objects; the string fallback
        // keeps us working through a deploy skew where the API still serves
        // the old bare-string array (treat those as canonical).
        const genreData = await getGenres(authCode)
        setGenres(genreData.map(g => typeof g === 'string' ? { name: g, isCanonical: true } : g))
      } catch (err) {
        console.log(err)
      }
    }
    loadData()
  }, [authCode, isAuthenticated, userEmail])

  // Sort/filter/view-mode choices for the catalog, persisted server-side per
  // user (see user_preferences table) so they follow the user across devices.
  const { preferences, setPreferences } = useUserPreferences(userEmail, authCode, LANDING_DEFAULTS)
  const landingFilter = useSearchSortFilter({ defaults: LANDING_DEFAULTS, external: { preferences, setPreferences } })
  // The personal-stack filter is local-only (not persisted) and independent
  // of the catalog filter above, so switching pages doesn't leak one filter
  // into the other.
  const stackFilter = useSearchSortFilter({ defaults: STACK_DEFAULTS })

  return (
    <AuthorizationProvider>
      <AuthAlbumContext.Provider value={{ authCode, albums, setAlbums }}>
        <MyStackContext.Provider value={{ myStack, setMyStack }}>
          <GenreContext.Provider value={{ genres }}>
            <LandingFilterContext.Provider value={landingFilter}>
              <StackFilterContext.Provider value={stackFilter}>
                <Header />
                <div className="app">
                  <ParticlesBackground />
                  <Routes>
                    <Route index element={<LoginPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/:id" element={<RecordPage />} />
                    <Route path="/add-stack" element={<AddStack />} />
                    <Route path="/my-stack" element={<MyStackPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                  </Routes>
                </div>
                <Footer />
              </StackFilterContext.Provider>
            </LandingFilterContext.Provider>
          </GenreContext.Provider>
        </MyStackContext.Provider>
      </AuthAlbumContext.Provider>
    </AuthorizationProvider>
  );
}

export default App;
