// summary-project/frontend/src/app.js
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Upload from './components/Upload.js';
import Loading from './components/Loading.js';
import Results from './components/Results.js';
import Error from './components/Error.js'; 
import Header from './components/header.js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Setting up auth listener...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed. User:', currentUser);
      setUser(currentUser);
    }, (error) => {
      console.error('Auth listener error:', error);
    });
    return () => {
      console.log('Cleaning up auth listener...');
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <BrowserRouter>
      <Header user={user} handleSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Upload user={user} handleSignOut={handleSignOut} />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/results" element={<Results />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;