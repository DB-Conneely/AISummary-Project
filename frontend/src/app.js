// summary-project/frontend/src/app.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Upload from './components/Upload.js';
import Loading from './components/Loading.js';
import Results from './components/Results.js';
import Error from './components/Error.js';
import Header from './components/header.js';
import './transitions.css';

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    }, (error) => {
      console.error('Auth listener error:', error);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <>
      <Header user={user} handleSignOut={handleSignOut} />
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="slide" timeout={500}>
          <Routes>
            <Route path="/" element={<Upload user={user} handleSignOut={handleSignOut} />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/results" element={<Results />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;