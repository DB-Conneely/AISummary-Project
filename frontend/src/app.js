// summary-project/frontend/src/App.js
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

function AppContent({ user, handleSignOut, authError }) {
  const location = useLocation();

  return (
    <>
      <Header user={user} handleSignOut={handleSignOut} />
      {authError && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50">
          Auth Error: {authError}
        </div>
      )}
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="slide" timeout={500}>
          <div>
            <Routes location={location}>
              <Route path="/" element={<Upload user={user} handleSignOut={handleSignOut} authError={authError} />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/results" element={<Results />} />
              <Route path="/error" element={<Error />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log('App.js: Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('App.js: Auth state changed:', currentUser);
      setUser(currentUser);
      if (!currentUser) {
        setAuthError('No user detected after sign-in. Check Firebase config or browser settings.');
      } else {
        setAuthError(null);
      }
    }, (error) => {
      console.error('App.js: Auth listener error:', error.message, error.code);
      setAuthError(error.message);
    });

    return () => {
      console.log('App.js: Cleaning up auth listener...');
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('App.js: Signing out...');
      await signOut(auth);
      setUser(null);
      setAuthError(null);
    } catch (error) {
      console.error('App.js: Sign-out error:', error.message, error.code);
      setAuthError(error.message);
    }
  };

  return (
    <BrowserRouter>
      <AppContent user={user} handleSignOut={handleSignOut} authError={authError} />
    </BrowserRouter>
  );
}

export default App;