import { useEffect, useState } from 'react'
import LoginPage from './LoginPage'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStackPage from './MyStackPage'
import '../CSS/App.css';
import { Routes, Route} from 'react-router-dom';
import  MyStackContext  from '../Context/MyStack'
import AuthAlbumContext from '../Context/AuthAlbumContext'

function App() {
    const [authCode, setAuthCode] = useState('')
    const [albums, setAlbums] = useState([])
    const [myStack, setMyStack] = useState([])

  return (
    <AuthAlbumContext.Provider value={{authCode, setAuthCode, albums, setAlbums}}>
      <MyStackContext.Provider value={{myStack, setMyStack}}>
      <Header />
        <div className="app">
            <Routes>
              <Route index element={<LoginPage />} />
              <Route path="/landing" element={<LandingPage/>} />
              <Route path="/:id" element={<RecordPage />} />
              <Route path="/add-stack" element={<AddStack />} />
              <Route path="/my-stack" element={<MyStackPage />} />
            </Routes>
        </div>
        <Footer />
      </MyStackContext.Provider>
    </AuthAlbumContext.Provider>
  );
}

export default App;
