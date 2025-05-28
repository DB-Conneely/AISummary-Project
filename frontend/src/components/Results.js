// summary-project/frontend/src/components/Results.js
import { useLocation, useNavigate } from 'react-router-dom';

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log('Results Location:', location);
  console.log('Results State:', state);

  if (!state) {
    navigate('/error', { state: { message: 'No results data available.' } });
    return null;
  }

  const { s3Url, textLength, bullets } = state;

  const handleDownload = () => {
    window.open(s3Url, '_blank');
  };

  // Split bullets into an array of lines and filter out empty ones
  const bulletPoints = bullets.split('\n').filter(bullet => bullet.trim().startsWith('•'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cpath d=%22M0 0h40v40H0z%22 fill=%22none%22/%3E%3Cpath d=%22M10 10h20v20H10z%22 fill=%22none%22 stroke=%22%233B82F6%22 stroke-width=%221%22/%3E%3Cpath d=%22M15 15h10v10H15z%22 fill=%22none%22 stroke=%22%233B82F6%22 stroke-width=%221%22/%3E%3C/svg%3E')]"></div>
      <div className="max-w-lg w-full bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-700 relative z-10">
        <h2 className="text-4xl font-extrabold text-white mb-6">Summary Results</h2>
        <p className="text-gray-400 mb-2">Text Length: {textLength} characters</p>
        <p className="text-gray-400 mb-6">
          Audio URL: <a href={s3Url} className="text-blue-400 hover:underline">{s3Url}</a>
        </p>
        <div className="mb-8">
          {bulletPoints.map((bullet, index) => (
            <p key={index} className="text-white mb-4">
              {bullet}
            </p>
          ))}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105 duration-300"
          >
            Back to Upload
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105 duration-300"
          >
            Download Audio
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;