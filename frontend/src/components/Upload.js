// summary-project/frontend/src/components/Upload.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

function Upload() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      navigate('/error', { state: { message: 'Failed to sign in with Google.' } });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
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
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Intu<span className="text-blue-400">AI</span>tive</h2>
        {user ? (
          <>
            <p className="text-white mb-4">Signed in as: {user.displayName}</p>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition mb-6"
            >
              Sign Out
            </button>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">YouTube URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., https://youtube.com/..."
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Audio/Video File (m4a/mp4)</label>
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
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 disabled:bg-gray-700 transition transform hover:scale-105"
              >
                {loading ? 'Processing...' : 'Summarize Now'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-white mb-4">Welcome!</h3>
            <p className="text-gray-300">
              This application was created to make summarising Videos/Audio into concise points more efficient.
            </p>
            <p className="text-gray-300">Please sign in below to get started:</p>
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
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