import { useEffect, useState } from 'react'
import LoginPage from './LoginPage'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStackPage from './MyStackPage'
import { MyStackProvider } from './MyStack'
import { getRecords, getUsers, getToken } from './APICalls';
import '../CSS/App.css';
import { Routes, Route} from 'react-router-dom';
function App() {
  const [records, setRecords] = useState([])
  function changeRecords(albums) {
    setRecords(albums)
  }
  // const [authCode, setAuthCode] = useStack()
  // useEffect(() => {
  //   getToken()
  //   .then(resp => console.log(resp))
  // },[]) 


  return (
    <>
      <Header />
      <div className="app">
        <MyStackProvider>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/landing" element={<LandingPage records={records} changeRecords={changeRecords}/>} />
            <Route path="/:id" element={<RecordPage records={records} />} />
            <Route path="/add-stack" element={<AddStack />} />
            <Route path="/my-stack" element={<MyStackPage />} />
          </Routes>
        </MyStackProvider>
      </div>
      <Footer />
    </>
  );
}

export default App;
