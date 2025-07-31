// summary-project/src/backend/index.js
// Main entry point for the backend server, setting up Express, Socket.IO, and API routes.

// Import Express for creating the web server.
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// Import Multer for handling file uploads.
const multer = require('multer');
// Import the handlePreRecorded function for processing uploaded files or YouTube URLs.
const { handlePreRecorded } = require('./handlers');
// Import the getMeetings function for retrieving stored meeting summaries from the database.
const { getMeetings } = require('./db');
// Import HTTP module to create a server for Socket.IO integration.
const http = require('http');
// Import Socket.IO Server for real-time communication with the frontend.
const { Server } = require('socket.io');
// Import CORS middleware to enable cross-origin requests from the frontend.
const cors = require('cors');

// Initialize Express application.
const app = express();
// Create an HTTP server using the Express app.
const server = http.createServer(app);
// Initialize Socket.IO server with CORS and transport configurations.
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from the frontend running on localhost:3000.
    methods: ['GET', 'POST'], // Restrict to GET and POST methods.
    credentials: true // Enable credentials for secure communication.
  },
  transports: ['polling', 'websocket'] // Support polling and WebSocket transports for Socket.IO.
});

// Handle new Socket.IO connections and log connection details.
io.on('connection', (socket) => {
  console.log('Socket connected, ID:', socket.id, 'Transport:', socket.conn.transport.name);
});

// Middleware to log all incoming requests for debugging.
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`, req.headers);
  next(); // Proceed to the next middleware or route.
});

// Enable CORS for the frontend with credentials support.
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// Parse incoming JSON request bodies.
app.use(express.json());
// Configure Multer to store uploaded files in the 'uploads/' directory.
const upload = multer({ dest: 'uploads/' });

// Define the root route to provide API usage information.
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.status(200).json({ message: 'Meeting Summarizer API. Use /upload (POST) or /meetings (GET).' });
});

// POST /upload route to handle file uploads or YouTube URLs for summarization.
app.post('/upload', upload.single('file'), async (req, res) => {
  // Extract Socket.IO ID from the request headers for progress updates.
  const socketId = req.headers['x-socket-id'];
  console.log('Received socket ID:', socketId);
  // Define a helper function to emit progress updates to the frontend via Socket.IO.
  const emitProgress = (stage, progress) => {
    if (socketId) {
      // Send progress update to the specific socket ID.
      io.to(socketId).emit('progress', { stage, progress });
      console.log('Emitting progress to:', { stage, progress, socketId });
    } else {
      // Log if no socket ID is provided, skipping the emit.
      console.log('No socketId, skipping progress emit:', { stage, progress });
    }
  };

  try {
    // Extract YouTube URL from the request body.
    const { url } = req.body;
    // Validate that either a URL or a file is provided.
    if (!url && !req.file) return res.status(400).json({ error: 'Please provide a YouTube URL or upload a file.' });
    // Use the URL if provided, otherwise use the uploaded file's path.
    const input = url || req.file.path;
    // Flag to indicate if the input is a file upload.
    const isFile = !!req.file;
    // Process the input (URL or file) and get the summarization result.
    const result = await handlePreRecorded(input, isFile, emitProgress);
    console.log('Sending result to frontend:', result);
    // Send the result (S3 URL, text length, summary bullets) to the frontend.
    res.json(result);
  } catch (error) {
    // Log any errors during processing for debugging.
    console.error('Error in /upload:', error);
    // Return a 500 error with the error message or a generic message.
    res.status(500).json({ error: error.message || 'Something went wrong.' });
  }
});

// GET /meetings route to retrieve all stored meeting summaries.
app.get('/meetings', async (req, res) => {
  try {
    // Fetch all meeting summaries from the database.
    const meetings = await getMeetings();
    // Send the meeting summaries as a JSON response.
    res.json(meetings);
  } catch (error) {
    // Return a 500 error if fetching meetings fails.
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
});

// Set the server port from environment variables or default to 5001.
const PORT = process.env.PORT || 5001;
// Start the server and log the running status.
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));