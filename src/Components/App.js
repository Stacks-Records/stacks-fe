import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import RecordPage from './RecordPage'
import Header from './Header'
import Footer from './Footer'
import AddStack from './AddStack'
import MyStackPage from './MyStackPage'
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
    <>
      <Header />
      <div className="app">
        <MyStackProvider>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path="/" element={<LandingPage records={records} />} />
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
