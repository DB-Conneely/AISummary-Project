// summary-project/src/frontend/src/components/Loading.js
// Component to display processing status and progress during summary generation.
// It handles real-time updates via WebSockets and manages the API upload.

// Import React hooks for managing component state, side effects, and refs.
import { useEffect, useState, useRef } from 'react';
// Import hooks for accessing route state and navigation.
import { useLocation, useNavigate } from 'react-router-dom';
// Import Socket.IO client for real-time communication.
import io from 'socket.io-client';
// Import Axios for making HTTP requests.
import axios from 'axios';
// Import CSS for transitions and animations.
import '../transitions.css';
// Import the Background component for consistent styling.
import Background from './Background';

// Loading component displays the progress of the summary generation process.
function Loading() {
  // useLocation hook provides access to the current route's state.
  const { state } = useLocation();
  // useNavigate hook allows programmatic navigation.
  const navigate = useNavigate();
  // Destructure URL and file from the route state.
  const { url, file } = state || {};
  // State for tracking the processing progress (0-100%).
  const [progress, setProgress] = useState(0);
  // State for displaying the current status message.
  const [status, setStatus] = useState('Starting process...');
  // Ref to prevent duplicate upload attempts.
  const isUploading = useRef(false);
  // Ref to ensure useEffect runs only once on mount.
  const hasMounted = useRef(false);

  console.log('Loading.js: Component mounted', { url, file });

  // useEffect hook for handling side effects like socket connection and API upload.
  useEffect(() => {
    // Prevent the effect from running twice in React's strict mode during development.
    if (hasMounted.current) {
      console.log('Loading.js: Component already mounted, skipping setup');
      return;
    }
    hasMounted.current = true;

    // If no URL or file is provided in state, navigate to an error page.
    if (!url && !file) {
      console.error('No URL or file provided');
      navigate('/error', { state: { message: 'No URL or file provided.' } });
      return;
    }

    // Initialize Socket.IO connection to the backend server.
    const socket = io('http://localhost:5001', {
      transports: ['polling'], // Use polling as a fallback transport.
      reconnection: false, // Disable automatic reconnection.
    });

    // Listen for successful socket connection.
    socket.on('connect', () => {
      console.log('Loading socket connected, ID:', socket.id);
      // Trigger the upload immediately after connection is established.
      upload();
    });

    // Listen for progress updates from the server.
    socket.on('progress', ({ stage, progress }) => {
      console.log('Progress update:', { stage, progress });
      setStatus(stage); // Update status message.
      setProgress(progress); // Update progress percentage.
      if (progress === 100) {
        console.log('Progress hit 100%, waiting for axios response...');
      }
    });

    // Listen for socket connection errors.
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      // Navigate to an error page if socket connection fails.
      navigate('/error', { state: { message: 'Failed to connect to server.' } });
    });

    // Async function to handle the file/URL upload to the backend.
    const upload = async () => {
      // Prevent multiple concurrent uploads.
      if (isUploading.current) {
        console.log('Upload skipped: already in progress');
        return;
      }
      isUploading.current = true; // Set flag to indicate upload is in progress.

      try {
        console.log('Upload attempt:', {
          url: url || 'no url',
          file: file?.name || 'no file',
          socketId: socket.id || 'none',
        });
        // Create FormData object for file uploads.
        const formData = new FormData();
        if (file) formData.append('file', file); // Append file if present.
        if (url) formData.append('url', url); // Append URL if present.

        // Send POST request to the backend /upload endpoint.
        const response = await axios.post('http://localhost:5001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type for file uploads.
            'x-socket-id': socket.id || '', // Pass socket ID for server-side progress updates.
          },
          timeout: 180000, // Set a timeout for the request (3 minutes).
        });
        console.log('Upload API Response:', response.data);
        // Navigate to the results page with the received data.
        navigate('/results', { state: response.data });
      } catch (error) {
        console.error('Upload error:', error.message, error.code, error.response?.data);
        // Extract error message from response or provide a generic one.
        const errorMsg = error.response?.data?.error || 'Something went wrong during upload.';
        // Navigate to the error page with the error message.
        navigate('/error', { state: { message: errorMsg } });
      } finally {
        isUploading.current = false; // Reset upload flag regardless of success or failure.
      }
    };

    // Clean up function: disconnect the socket when the component unmounts.
    return () => {
      console.log('Disconnecting Loading socket, ID:', socket.id);
      socket.disconnect();
    };
  }, [url, file, navigate]); // Dependencies for useEffect: re-run if URL, file, or navigate changes.

  return (
    <Background>
      <div className="flex items-center justify-center min-h-screen relative">
        {/* Animated cog image (bottom left). */}
        <div className="absolute bottom-0 left-0 transform translate-x-[-30%] translate-y-[30%]">
          <img
            src="/cog.png"
            alt="Bottom Left Cog"
            className="w-40 h-40 animate-spin-slow drop-shadow-md"
          />
        </div>
        {/* Animated cog image (top right). */}
        <div className="absolute top-0 right-0 transform translate-x-[20%] translate-y-[0%]">
          <img
            src="/cog.png"
            alt="Top Right Cog"
            className="w-40 h-40 animate-spin-medium drop-shadow-md"
          />
        </div>
        {/* Main content box for displaying processing status. */}
        <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 text-center z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6">Processing Your Summary</h2>
          {/* Loading spinner animation. */}
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          {/* Current status message. */}
          <p className="text-base text-gray-400 mb-4">{status}</p>
          {/* Progress bar container. */}
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            {/* Actual progress bar, width controlled by 'progress' state. */}
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Background>
  );
}

// Export the Loading component as the default export.
export default Loading;