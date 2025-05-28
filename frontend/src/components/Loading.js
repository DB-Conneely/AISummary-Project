// summary-project/frontend/src/components/Loading.js
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

function Loading() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { url, file } = state || {};
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Starting process...');
  const isUploading = useRef(false);
  const hasMounted = useRef(false);

  console.log('Loading.js: Component mounted', { url, file });

  useEffect(() => {
    if (hasMounted.current) {
      console.log('Loading.js: Component already mounted, skipping setup');
      return;
    }
    hasMounted.current = true;

    if (!url && !file) {
      console.error('No URL or file provided');
      navigate('/error', { state: { message: 'No URL or file provided.' } });
      return;
    }

    const socket = io('http://localhost:5001', {
      transports: ['polling'],
      reconnection: false,
    });

    socket.on('connect', () => {
      console.log('Loading socket connected, ID:', socket.id);
    });

    socket.on('progress', ({ stage, progress }) => {
      console.log('Progress update:', { stage, progress });
      setStatus(stage);
      setProgress(progress);
      if (progress === 100) {
        console.log('Progress hit 100%, waiting for axios response...');
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      navigate('/error', { state: { message: 'Failed to connect to server.' } });
    });

    const upload = async () => {
      if (isUploading.current) {
        console.log('Upload skipped: already in progress');
        return;
      }
      isUploading.current = true;
      try {
        console.log('Upload attempt:', {
          url: url || 'no url',
          file: file?.name || 'no file',
          socketId: socket.id || 'none',
        });
        const formData = new FormData();
        if (file) formData.append('file', file);
        if (url) formData.append('url', url);
        const response = await axios.post('http://localhost:5001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-socket-id': socket.id || '',
          },
          timeout: 180000,
        });
        console.log('Upload API Response:', response.data);
        navigate('/results', { state: response.data });
      } catch (error) {
        console.error('Upload error:', error.message, error.code, error.response?.data);
        const errorMsg = error.response?.data?.error || 'Something went wrong during upload.';
        navigate('/error', { state: { message: errorMsg } });
      } finally {
        isUploading.current = false;
      }
    };

    socket.on('connect', upload);

    return () => {
      console.log('Disconnecting Loading socket, ID:', socket.id);
      socket.disconnect();
    };
  }, [url, file, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cpath d=%22M0 0h40v40H0z%22 fill=%22none%22/%3E%3Cpath d=%22M10 10h20v20H10z%22 fill=%22none%22 stroke=%22%233B82F6%22 stroke-width=%221%22/%3E%3Cpath d=%22M15 15h10v10H15z%22 fill=%22none%22 stroke=%22%233B82F6%22 stroke-width=%221%22/%3E%3C/svg%3E')]"></div>
      <div className="absolute bottom-0 left-0 transform translate-x-[-30%] translate-y-[30%]">
        <img
          src="/cog.png"
          alt="Bottom Left Cog"
          className="w-40 h-40 animate-spin-slow drop-shadow-md"
        />
      </div>
      <div className="absolute top-0 right-0 transform translate-x-[20%] translate-y-[0%]">
        <img
          src="/cog.png"
          alt="Top Right Cog"
          className="w-40 h-40 animate-spin-medium drop-shadow-md"
        />
      </div>
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700 text-center z-10">
        <h2 className="text-4xl font-extrabold text-white mb-6">Processing Your Summary</h2>
        <div className="flex justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-base text-gray-400 mb-4">{status}</p>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;