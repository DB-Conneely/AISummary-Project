// summary-project/frontend/src/App.js
// Main application component responsible for routing, authentication state, and overall layout.

// Import React hooks for managing state and side effects.
import { useState, useEffect } from 'react';
// Import routing components from react-router-dom.
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// Import transition components for animating route changes.
import { TransitionGroup, CSSTransition } from 'react-transition-group';
// Import Firebase authentication instance.
import { auth } from './firebase';
// Import Firebase authentication functions for managing user state and sign-out.
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Import custom components used in the application.
import Upload from './components/Upload.js';
import Loading from './components/Loading.js';
import Results from './components/Results.js';
import Error from './components/Error.js';
import Header from './components/header.js';
import MeetingHistory from './components/MeetingHistory.js';
import MeetingDetail from './components/MeetingDetail.js';  // Add this import

// Import CSS for transitions and animations.
import './transitions.css';

// AppContent component handles routing and displays content based on the current URL.
// It receives user authentication status, sign-out handler, and authentication errors as props.
function AppContent({ user, handleSignOut, authError }) {
  // Get the current location object for route transitions.
  const location = useLocation();

  return (
    <>
      {/* Header component displays user info and sign-out button. */}
      <Header user={user} handleSignOut={handleSignOut} />
      {/* Display authentication error messages if present. */}
      {authError && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center z-50">
          Auth Error: {authError}
        </div>
      )}
      {/* TransitionGroup manages entering/exiting transitions for its children. */}
      <TransitionGroup>
        {/* CSSTransition applies CSS classes for transitions based on route changes. */}
        <CSSTransition key={location.key} classNames="slide" timeout={500}>
          <div>
            {/* Routes component defines application routes. */}
            <Routes location={location}>
              {/* Route for the Upload component (homepage). */}
              <Route path="/" element={<Upload user={user} handleSignOut={handleSignOut} authError={authError} />} />
              {/* Route for the Loading component. */}
              <Route path="/loading" element={<Loading />} />
              {/* Route for the Results component. */}
              <Route path="/results" element={<Results />} />
              {/* Route for the Error component. */}
              <Route path="/error" element={<Error />} />
              {/* Route for Meeting History. */}
              <Route path="/history" element={<MeetingHistory />} />
              {/* Add this new route for Meeting Detail */}
              <Route path="/history/detail" element={<MeetingDetail />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
}

// App component manages the global authentication state.
function App() {
  // State to hold the current authenticated user object.
  const [user, setUser] = useState(null);
  // State to hold any authentication-related errors.
  const [authError, setAuthError] = useState(null);

  // useEffect hook to set up and clean up the Firebase authentication state listener.
  useEffect(() => {
    console.log('App.js: Setting up auth listener...');
    // Listen for changes in the Firebase authentication state.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('App.js: Auth state changed:', currentUser);
      setUser(currentUser); // Update user state.
      if (!currentUser) {
        // If no current user, set a specific error message.
        setAuthError('No user detected after sign-in. Check Firebase config or browser settings.');
      } else {
        setAuthError(null); // Clear any existing auth errors if a user is found.
      }
    }, (error) => {
      // Handle errors during authentication state observation.
      console.error('App.js: Auth listener error:', error.message, error.code);
      setAuthError(error.message); // Set the error message.
    });

    // Cleanup function: unsubscribe from the listener when the component unmounts.
    return () => {
      console.log('App.js: Cleaning up auth listener...');
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Async function to handle user sign-out.
  const handleSignOut = async () => {
    try {
      console.log('App.js: Signing out...');
      await signOut(auth); // Call Firebase sign-out function.
      setUser(null); // Clear user state.
      setAuthError(null); // Clear any auth errors.
    } catch (error) {
      // Catch and log any errors during sign-out.
      console.error('App.js: Sign-out error:', error.message, error.code);
      setAuthError(error.message); // Set the sign-out error message.
    }
  };

  return (
    // BrowserRouter enables client-side routing for the application.
    <BrowserRouter>
      {/* Render AppContent, passing down user, sign-out handler, and auth error. */}
      <AppContent user={user} handleSignOut={handleSignOut} authError={authError} />
    </BrowserRouter>
  );
}

// Export the App component as the default export.
export default App;