// summary-project/frontend/src/components/errorPage.js
// React component for displaying error messages
import { useLocation, Link } from 'react-router-dom';

function Error() {
  const { state } = useLocation();
  const { message } = state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 text-center">
        <h2 className="text-4xl font-extrabold text-red-400 mb-6">Something Went Wrong</h2>
        <p className="text-gray-300 mb-8">{message || 'An unexpected error occurred.'}</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default Error;