// summary-project/frontend/src/components/MeetingHistory.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background from './Background';

function MeetingHistory() {
  // State for meetings list, loading, error.
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <Background>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-4xl font-extrabold text-white mb-6">Meeting History</h2>
          {meetings.length === 0 ? (
            <p className="text-gray-400">No summaries yet.</p>
          ) : (
            meetings.map((meeting, index) => (
              <div key={index} className="mb-8 border-b border-gray-700 pb-4">
                <h3 className="text-2xl text-white mb-2">{meeting.filename}</h3>
                <p className="text-gray-400 mb-2">Date: {new Date(meeting.created_at).toLocaleString()}</p>
                <p className="text-gray-300 mb-2">Summary:</p>
                <ul className="list-disc pl-5 text-white">
                  {meeting.bullets.split('\n').map((bullet, i) => <li key={i}>{bullet}</li>)}
                </ul>
                <p className="text-gray-300 mt-4 mb-2">Full Transcription:</p>
                <p className="text-white bg-gray-800 p-4 rounded-lg overflow-auto max-h-40">{meeting.text}</p>
              </div>
            ))
          )}
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition"
          >
            Back to Upload
          </button>
        </div>
      </div>
    </Background>
  );
}

export default MeetingHistory;