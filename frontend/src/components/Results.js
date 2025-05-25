// summary-project/frontend/src/components/Results.js
import { useLocation, Link } from 'react-router-dom';

function Results() {
  const location = useLocation();
  console.log('Results Location:', location);
  console.log('Results State:', location.state);
  const { s3Url, textLength, bullets } = location.state || {};

  if (!s3Url || !textLength || !bullets) {
    console.log('Missing data in Results:', { s3Url, textLength, bullets });
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-center">
        No results found. Please try again.
      </div>
    );
  }

  // Clean up bullet points: split, remove duplicates, trim, and filter empty lines
  const uniqueBullets = [...new Set(bullets.split('\n')
    .map(bullet => bullet.trim())
    .filter(bullet => bullet && bullet.startsWith('•')))];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-3xl w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">Intu<span className="text-blue-400">AI</span>tive Summary</h2>
        <div className="space-y-6">
          <p>
            <strong className="text-gray-400">Audio File:</strong>{' '}
            <a href={s3Url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              Listen
            </a>
          </p>
          <p>
            <strong className="text-gray-400">Transcription Length:</strong> {textLength} characters
          </p>
          <h3 className="text-2xl font-semibold text-white">Key Points</h3>
          <ul className="list-disc pl-6 space-y-3 text-gray-300">
            {uniqueBullets.map((bullet, index) => (
              <li key={index} className="transition hover:text-white">{bullet.replace('• ', '')}</li>
            ))}
          </ul>
          <div className="text-center">
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition transform hover:scale-105"
            >
              Return to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;