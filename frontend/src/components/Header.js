// summary-project/frontend/src/components/header.js
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Header({ user, handleSignOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/">
          <img src="/logo.svg" alt="IntuitiveAI Logo" className="h-10 hover:opacity-80 transition" />
        </Link>
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                ref={iconRef}
                src="/icon.svg"
                alt="Profile Icon"
                className="h-6 w-6 hover:scale-105 transition duration-300"
                onMouseEnter={() => setIsDropdownOpen(true)}
              />
            </div>
            <div
              className={`absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50 transition-opacity duration-200 ${
                isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="px-4 py-3">
                <p className="text-white text-sm">
                  Signed in as: {user.displayName}
                </p>
              </div>
              <div className="border-t border-gray-700">
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white bg-red-600 hover:bg-red-500 rounded-b-lg transition duration-300 hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;