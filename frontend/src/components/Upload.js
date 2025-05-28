// summary-project/frontend/src/components/Upload.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithRedirect } from '../firebase';

function Upload({ user, handleSignOut }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      console.log('Initiating Google sign-in...');
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Sign-in error:', error);
      navigate('/error', { state: { message: 'Failed to sign in with Google.' } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url && !file) {
      navigate('/error', { state: { message: 'Please provide a URL or file.' } });
      return;
    }
    setLoading(true);
    navigate('/loading', { state: { url, file } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-lg w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
          Intu<span className="text-blue-400">AI</span>tive
        </h2>
        {user ? (
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
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 disabled:bg-gray-700 transition transform hover:scale-105 duration-300"
            >
              {loading ? 'Processing...' : 'Summarize Now'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Welcome!</h3>
            <p className="text-base text-gray-300">
              This application was created to make summarising Videos/Audio into concise points more efficient.
            </p>
            <p className="text-base text-gray-300">Please sign in below to get started:</p>
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 transition transform hover:scale-105 duration-300"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;