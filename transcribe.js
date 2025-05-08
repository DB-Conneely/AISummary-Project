//transcribe.js
const { AssemblyAI } = require('assemblyai');
require('dotenv').config({ path: './.env' });

// Transcribes audio using AssemblyAI API, returns text
async function transcribeAudio(audioFile) {
  try {
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY
    });
    const config = {
      audio: audioFile
    };
    const transcript = await client.transcripts.transcribe(config);
    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }
    return transcript.text || '';
  } catch (error) {
    console.error('Transcription error:', error.message);
    throw error;
  }
}

module.exports = { transcribeAudio };