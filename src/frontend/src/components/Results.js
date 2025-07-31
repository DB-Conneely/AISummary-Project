// summary-project/frontend/src/components/Results.js
// Component to display the summary results, including text length, S3 audio URL, and bullet points.

// Import React hooks for accessing route state and navigation.
import { useLocation, useNavigate } from 'react-router-dom';
// Import the Background component for consistent styling.
import Background from './Background';

// Results component displays the processed summary information.
function Results() {
  // useLocation hook provides access to the current route's state.
  const { state } = useLocation();
  // useNavigate hook allows programmatic navigation.
  const navigate = useNavigate();

  console.log('Results Location:', location);
  console.log('Results State:', state);

  // If no state data is available (e.g., direct access without submission),
  // navigate to the error page with a relevant message.
  if (!state) {
    navigate('/error', { state: { message: 'No results data available.' } });
    return null; // Don't render anything if there's no data.
  }

  // Destructure the summary data from the location state.
  const { s3Url, textLength, bullets } = state;

  // Function to handle downloading the audio file from the S3 URL.
  const handleDownload = () => {
    // Opens the S3 URL in a new browser tab, effectively initiating a download or playback.
    window.open(s3Url, '_blank');
  };

  // Process the raw 'bullets' string into an array of individual bullet points.
  // It splits the string by newline and filters to ensure each bullet starts with '•', '-', or '*'.
  const bulletPoints = bullets.split('\n')
    .map(bullet => bullet.trim())  // Trim whitespace from each line
    .filter(bullet => bullet.startsWith('•') || bullet.startsWith('-') || bullet.startsWith('*'));  // Include common bullet starters

  return (
    <Background>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-lg w-full bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-700 relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6">Summary Results</h2>
          {/* Display the length of the transcribed text. */}
          <p className="text-gray-400 mb-2">Text Length: {textLength} characters</p>
          {/* Display the S3 audio URL with a clickable link. */}
          <p className="text-gray-400 mb-6">
            Audio URL: <a href={s3Url} className="text-blue-400 hover:underline">{s3Url}</a>
          </p>
          <div className="mb-8">
            {/* Map over the processed bullet points and display each. */}
            {bulletPoints.map((bullet, index) => (
              <p key={index} className="text-white mb-4">
                {bullet}
              </p>
            ))}
          </div>
          <div className="flex space-x-4">
            {/* Button to navigate back to the upload page. */}
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105 duration-300"
            >
              Back to Upload
            </button>
            {/* Button to trigger the audio download. */}
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105 duration-300"
            >
              Download Audio
            </button>
          </div>
        </div>
      </div>
    </Background>
  );
}

// Export the Results component as the default export.
export default Results;