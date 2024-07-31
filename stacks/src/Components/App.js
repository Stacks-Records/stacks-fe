import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStack from './MyStackPage'
import { getRecords } from './APICalls';
import '../CSS/App.css';

function App() {
  const [records, setRecords] = useState([])
  const [myStack, setMyStack] = useState([])

  const addToStack = (album) => {
    setMyStack([...myStack, album])
  }


  useEffect(() => {
    getRecords()
      .then(data => setRecords(data)
      ).catch(error => console.log(error.message));
  }, []);

  return (
    <Router>
      <Header />
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage records={records} addtoStack={addToStack} />} />
          <Route path="/:id" element={<RecordPage records={records} addtoStack={addToStack} />} />
          <Route path="/add-stack" element={<AddStack />} />
          <Route path="/my-stack" element={<MyStack />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
