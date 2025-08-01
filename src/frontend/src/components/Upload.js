// summary-project/src/frontend/src/components/Upload.js
// Component for handling user input: YouTube URLs or audio/video file uploads.
// It also manages user authentication (sign-in/sign-out).

// Import React hooks for managing component state.
import { useState } from 'react';
// Import useNavigate hook for programmatic navigation.
import { useNavigate } from 'react-router-dom';
// Import Firebase authentication utilities.
import { auth, provider, signInWithPopup } from '../firebase';
// Import the Background component for consistent styling.
import Background from './Background';

// Upload component receives user authentication status, sign-out handler, and auth errors as props.
function Upload({ user, handleSignOut, authError }) {
  // State for storing the YouTube URL input.
  const [url, setUrl] = useState('');
  // State for storing the selected file input.
  const [file, setFile] = useState(null);
  // State to indicate if a submission is in progress.
  const [loading, setLoading] = useState(false);
  // Hook to enable navigation between routes.
  const navigate = useNavigate();

  console.log('Upload.js: Rendering with user:', user);

  // Async function to handle Google sign-in using a popup.
  const handleSignIn = async () => {
    try {
      console.log('Upload.js: Initiating Google sign-in with popup...');
      // Attempt to sign in with Google.
      const result = await signInWithPopup(auth, provider);
      console.log('Upload.js: Sign-in result:', result.user);
      // No explicit state update for user here, as App.js's onAuthStateChanged listener handles it.
    } catch (error) {
      console.error('Upload.js: Sign-in error:', error.message, error.code);
      // Navigate to the error page if sign-in fails.
      navigate('/error', { state: { message: 'Failed to sign in with Google: ' + error.message } });
    }
  };

  // Async function to handle form submission (URL or file upload).
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    console.log('Upload.js: handleSubmit called', { url, file });
    // Check if either a URL or a file has been provided.
    if (!url && !file) {
      // Navigate to the error page if no input is provided.
      navigate('/error', { state: { message: 'Please provide a URL or file.' } });
      return;
    }
    setLoading(true); // Set loading state to true to show processing feedback.
    // Navigate to the loading page, passing the URL and file as state.
    navigate('/loading', { state: { url, file } });
  };

  return (
    // Background component provides the visual backdrop for the page.
    <Background>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
            Intu<span className="text-blue-400">AI</span>tive
          </h2>
          {/* Display authentication error message if present. */}
          {authError && (
            <p className="text-red-400 mb-4 text-center">{authError}</p>
          )}

          {/* Conditional rendering based on user authentication status. */}
          {user ? (
            // Form for authenticated users to upload URLs or files.
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., https://youtube.com/..."
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Audio/Video File (m4a/mp4)
                </label>
                <input
                  type="file"
                  accept=".m4a,.mp4"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer file:transition file:duration-300 file:hover:bg-blue-500 file:hover:scale-105 file:active:scale-95"
                />
              </div>
              <button
                type="submit"
                disabled={loading} // Disable button while loading.
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 disabled:bg-gray-700 transition transform hover:scale-105 duration-300"
              >
                {loading ? 'Processing...' : 'Summarize Now'}
              </button>
            </form>
          ) : (
            // Sign-in prompt for unauthenticated users.
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-white mb-4">Welcome!</h3>
              <p className="text-gray-300">
                This application was created to make summarising Videos/Audio into concise points more efficient.
              </p>
              <p className="text-gray-300">Please sign in below to get started:</p>
              <button
                onClick={handleSignIn} // Trigger Google sign-in on click.
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 transition transform hover:scale-105 duration-300"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </Background>
  );
}

// Export the Upload component as the default export.
export default Upload;