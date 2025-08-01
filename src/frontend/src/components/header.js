// summary-project/src/frontend/src/components/header.js
// Header component displaying the application logo and user authentication status with a dropdown menu.

// Import Link component for navigation.
import { Link } from 'react-router-dom';
// Import React hooks for managing component state, side effects, and refs.
import { useState, useEffect, useRef } from 'react';

// Header component receives user authentication status and sign-out handler as props.
function Header({ user, handleSignOut }) {
  // State to control the visibility of the dropdown menu.
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Ref to detect clicks outside the dropdown to close it.
  const dropdownRef = useRef(null);
  // Ref for the profile icon (though not strictly necessary for this logic).
  const iconRef = useRef(null);

  // useEffect hook to add and clean up an event listener for clicks outside the dropdown.
  useEffect(() => {
    // Function to handle clicks outside the dropdown.
    const handleClickOutside = (event) => {
      // If the dropdown exists and the click is outside it, close the dropdown.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    // Add event listener when the component mounts.
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup function: remove event listener when the component unmounts.
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array ensures this effect runs only once on mount and unmount.

  return (
    <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md py-4 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Link to the homepage (Upload component) using the logo. */}
        <Link to="/">
          <img src="/logo.svg" alt="IntuitiveAI Logo" className="h-10 hover:opacity-80 transition" />
        </Link>

        {/* Conditional rendering: show profile icon and dropdown if a user is logged in. */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile icon that toggles the dropdown on click. */}
            <div
              className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                ref={iconRef}
                src="/icon.svg"
                alt="Profile Icon"
                className="h-6 w-6 hover:scale-105 transition duration-300"
                // Open dropdown on mouse enter for smoother UX.
                onMouseEnter={() => setIsDropdownOpen(true)}
              />
            </div>
            {/* Dropdown menu content, visibility controlled by `isDropdownOpen` state. */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50 transition-opacity duration-200 ${
                isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              // Close dropdown on mouse leave.
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="px-4 py-3">
                {/* Display the signed-in user's display name. */}
                <p className="text-white text-sm">
                  Signed in as: {user.displayName}
                </p>
              </div>
              <div className="border-t border-gray-700">
                <Link
                  to="/history"
                  className="block px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 transition duration-300"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  History
                </Link>
              </div>
              <div className="border-t border-gray-700">
                {/* Sign Out button. */}
                <button
                  onClick={() => {
                    handleSignOut(); // Call the sign-out function passed from App.js.
                    setIsDropdownOpen(false); // Close the dropdown after signing out.
                  }}
                  className="w-full text-left px-4 py-2 text-white bg-red-600 hover:bg-red-500 rounded-b-lg transition duration-300 hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : null /* Render nothing if no user is logged in. */}
      </div>
    </header>
  );
}

// Export the Header component as the default export.
export default Header;