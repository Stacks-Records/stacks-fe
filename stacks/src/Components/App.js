import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {useState, useEffect} from 'react'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
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
    <Router> 
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage records={records} />} />
          <Route path="/:id" element={<RecordPage records={records} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
