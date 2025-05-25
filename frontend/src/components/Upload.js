// summary-project/frontend/src/components/Upload.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url && !file) {
      navigate('/error', { state: { message: 'Please provide a URL or file.' } });
      return;
    }
    setLoading(true);
    console.log('Navigating to loading:', { url, file });
    navigate('/loading', { state: { url, file } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-lg w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Intu<span className="text-blue-400">AI</span>tive</h2>
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
      </div>
    </div>
  );
}

export default Upload;