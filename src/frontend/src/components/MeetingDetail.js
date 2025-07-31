// summary-project/frontend/src/components/MeetingDetail.js
import { useLocation, useNavigate } from 'react-router-dom';
import Background from './Background';

function MeetingDetail() {
  const { state } = useLocation();  // Get passed meeting data
  const meeting = state?.meeting;
  const navigate = useNavigate();

  if (!meeting) {
    return <Background><div className="flex items-center justify-center min-h-screen text-red-400">No meeting data available.</div></Background>;
  }

  const bulletPoints = meeting.bullets.split('\n')
    .map(line => line.trim())  // Trim whitespace
    .filter(bullet => bullet.startsWith('•') || bullet.startsWith('-') || bullet.startsWith('*'));  // Include common starters

  return (
    <Background>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-700 relative">
          {/* Back button above title in top-left */}
          <button
            onClick={() => navigate('/history')}
            className="absolute top-4 left-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            Back
          </button>
          <h2 className="text-4xl font-extrabold text-white mb-6 mt-12">Meeting Details</h2> {/* Add margin-top to avoid overlap */}
          <p className="text-gray-400 mb-2">Audio URL: <a href={meeting.filename} className="text-blue-400 hover:underline">{meeting.filename}</a></p>
          <p className="text-gray-400 mb-6">Date: {new Date(meeting.created_at).toLocaleString()}</p>
          <div className="mb-8">
            {bulletPoints.map((bullet, index) => (
              <p key={index} className="text-white mb-4">
                {bullet}
              </p>
            ))}
          </div>
          <p className="text-gray-300 mb-2">Full Transcription:</p>
          <p className="text-white bg-gray-800 p-4 rounded-lg overflow-auto max-h-60">{meeting.text}</p>
        </div>
      </div>
    </Background>
  );
}

export default MeetingDetail;