import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
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
import ParticlesBackground from './ParticlesBackground'
import { getRecords, getStack } from './APICalls'

function App() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
  const [authCode, setAuthCode] = useState(() => {
    try {
      const stored = localStorage.getItem('authAccessToken')
      return stored ? JSON.parse(stored) : ''
    } catch {
      return ''
    }
  })
  const [albums, setAlbums] = useState([])
  const [myStack, setMyStack] = useState([])

  // Acquire/refresh the access token whenever the user is authenticated.
  // Runs on any route, so a reload on an inner page rehydrates the token.
  useEffect(() => {
    if (!isAuthenticated) return
    getAccessTokenSilently()
      .then(token => {
        setAuthCode(token)
        localStorage.setItem('authAccessToken', JSON.stringify(token))
      })
      .catch(err => console.log(err))
  }, [isAuthenticated, getAccessTokenSilently])

  // Load records + the user's stack once a token is available. Owning this
  // here (instead of in LoginPage) keeps every page reload-safe.
  useEffect(() => {
    if (!authCode || !isAuthenticated || !user) return
    const loadData = async () => {
      try {
        const records = await getRecords(authCode)
        setAlbums(records)
        const stack = await getStack(user.email, authCode)
        setMyStack(stack[0]?.mystack ?? [])
      } catch (err) {
        console.log(err)
      }
    }
    loadData()
  }, [authCode, isAuthenticated, user])

  return (
    <AuthorizationProvider>
      <AuthAlbumContext.Provider value={{ authCode, setAuthCode, albums, setAlbums }}>
        <MyStackContext.Provider value={{ myStack, setMyStack }}>
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
        </MyStackContext.Provider>
      </AuthAlbumContext.Provider>
    </AuthorizationProvider>
  );
}

export default App;
