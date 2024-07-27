import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import '../CSS/App.css';

function App() {
  return (
    <Router> 
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:albumId" element={<RecordPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
