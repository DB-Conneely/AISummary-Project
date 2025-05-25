// summary-project/frontend/src/app.js
// React router setup for the meeting summarizer frontend
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import Loading from './components/Loading';
import Results from './components/Results';
import Error from './components/Error';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/results" element={<Results />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;