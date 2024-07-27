import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {useState, useEffect} from 'react'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import '../CSS/App.css';
import { getRecords } from './APICalls';

function App() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    getRecords()
    .then(data => setRecords(data)
  ).catch(error => console.error(error));
}, []);
  return (
    <Router> 
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage records={records} />} />
          <Route path="/:albumId" element={<RecordPage records={records} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
