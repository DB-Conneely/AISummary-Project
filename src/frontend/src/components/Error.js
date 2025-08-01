// summary-project/src/frontend/src/components/Error.js
// Component to display error messages to the user.

// Import hooks for accessing route state and Link component for navigation.
import { useLocation, Link } from 'react-router-dom';
// Import the Background component for consistent styling.
import Background from './Background';

// Error component displays a user-friendly error message.
function Error() {
  // useLocation hook provides access to the current route's state.
  const { state } = useLocation();
  // Destructure the 'message' from the location state, or default to an empty object.
  const { message } = state || {};

  return (
    <Background>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 text-center">
          <h2 className="text-4xl font-extrabold text-red-400 mb-6">Something Went Wrong</h2>
          {/* Display the error message passed in state, or a generic message if none provided. */}
          <p className="text-gray-300 mb-8">{message || 'An unexpected error occurred.'}</p>
          {/* Link to navigate back to the homepage for the user to try again. */}
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
          >
            Try Again
          </Link>
        </div>
      </div>
    </Background>
  );
}

// Export the Error component as the default export.
export default Error;