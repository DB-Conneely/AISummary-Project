// summary-project/src/frontend/src/components/MeetingHistory.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background from './Background';

function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5; // Updated to 5
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('http://localhost:5001/meetings');
        setMeetings(response.data);
      } catch (err) {
        setError('Failed to load history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  if (loading) return <Background><div className="flex items-center justify-center min-h-screen text-white">Loading...</div></Background>;
  if (error) return <Background><div className="flex items-center justify-center min-h-screen text-red-400">{error}</div></Background>;

  const totalPages = Math.ceil(meetings.length / perPage);
  const paginatedMeetings = meetings.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <Background>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 relative">
          {/* Back to Upload above title in top-left */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            Back to Upload
          </button>
          <h2 className="text-4xl font-extrabold text-white mb-6 mt-12">Meeting History</h2> {/* Add margin-top to avoid overlap */}
          {meetings.length === 0 ? (
            <p className="text-gray-400">No summaries yet.</p>
          ) : (
            paginatedMeetings.map((meeting, index) => {
              const globalIndex = ((currentPage - 1) * perPage) + index + 1;
              const bullets = meeting.bullets.split('\n')
                .map(line => line.trim())  // Trim whitespace
                .filter(bullet => bullet.startsWith('•') || bullet.startsWith('-') || bullet.startsWith('*'));  // Include common starters
              const firstBullet = bullets[0] || 'No summary';
              return (
                <div key={index} className="mb-8 border-b border-gray-700 pb-4">
                  <h3 className="text-2xl text-white mb-2">Meeting {globalIndex} - {new Date(meeting.created_at).toLocaleString()}</h3>
                  <p className="text-white mb-2">{firstBullet}</p>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
                    onClick={() => navigate('/history/detail', { state: { meeting } })}
                  >
                    View
                  </button>
                </div>
              );
            })
          )}
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Background>
  );
}

export default MeetingHistory;