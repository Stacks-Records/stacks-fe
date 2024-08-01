import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStack from './MyStackPage'
import { MyStackProvider } from './MyStack'
import { getRecords } from './APICalls';
import '../CSS/App.css';

function App() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    getRecords()
      .then(data => setRecords(data)
      ).catch(error => console.log(error.message));
  }, []);

  return (
    <MyStackProvider>
      <Router>
        <Header />
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage records={records} />} />
            <Route path="/:id" element={<RecordPage records={records} />} />
            <Route path="/add-stack" element={<AddStack />} />
            <Route path="/mystack" element={<MyStack />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </MyStackProvider>
  );
}

export default App;
