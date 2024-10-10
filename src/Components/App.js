import { useEffect, useState } from 'react'
import LoginPage from './LoginPage'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStackPage from './MyStackPage'
import { MyStackProvider } from './MyStack'
import '../CSS/App.css';
import { Routes, Route} from 'react-router-dom';

function App() {



  return (
    <>
      <Header />
      <div className="app">
        <MyStackProvider>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/landing" element={<LandingPage/>} />
            <Route path="/:id" element={<RecordPage />} />
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
