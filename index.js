// summary-project/index.js
const express = require('express');
const multer = require('multer');
const { handlePreRecorded } = require('./handlers');
const { getMeetings } = require('./db');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['polling', 'websocket']
});

io.on('connection', (socket) => {
  console.log('Socket connected, ID:', socket.id, 'Transport:', socket.conn.transport.name);
});

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`, req.headers);
  next();
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.status(200).json({ message: 'Meeting Summarizer API. Use /upload (POST) or /meetings (GET).' });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const socketId = req.headers['x-socket-id'];
  console.log('Received socket ID:', socketId);
  const emitProgress = (stage, progress) => {
    if (socketId) {
      io.to(socketId).emit('progress', { stage, progress });
      console.log('Emitting progress to:', { stage, progress, socketId });
    } else {
      console.log('No socketId, skipping progress emit:', { stage, progress });
    }
  };

  try {
    const { url } = req.body;
    if (!url && !req.file) return res.status(400).json({ error: 'Please provide a YouTube URL or upload a file.' });
    const input = url || req.file.path;
    const isFile = !!req.file;
    const result = await handlePreRecorded(input, isFile, emitProgress);
    console.log('Sending result to frontend:', result);
    res.json(result);
  } catch (error) {
    console.error('Error in /upload:', error);
    res.status(500).json({ error: error.message || 'Something went wrong.' });
  }
});

app.get('/meetings', async (req, res) => {
  try {
    const meetings = await getMeetings();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings.' });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));