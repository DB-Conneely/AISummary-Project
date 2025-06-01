// summary-project/transcribe.js
// Module for transcribing audio files using the AssemblyAI API.

// Import the AssemblyAI library for audio transcription.
const { AssemblyAI } = require('assemblyai');
// Load environment variables from the .env file for secure API key access.
require('dotenv').config({ path: './.env' });

// Async function to transcribe an audio file and return the transcribed text.
async function transcribeAudio(audioFile) {
  try {
    // Initialize the AssemblyAI client with the API key from environment variables.
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY // Use the API key stored in .env.
    });
    // Configure the transcription request with the audio file URL (e.g., S3 URL).
    const config = {
      audio: audioFile // Specify the audio file to transcribe.
    };
    // Send the transcription request to AssemblyAI and await the response.
    const transcript = await client.transcripts.transcribe(config);
    // Check if the transcription failed, and throw an error with details if so.
    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }
    // Return the transcribed text, or an empty string if no text is available.
    return transcript.text || '';
  } catch (error) {
    // Log any transcription errors for debugging purposes.
    console.error('Transcription error:', error.message);
    // Rethrow the error to be handled by the calling function.
    throw error;
  }
}

// Export the transcribeAudio function for use in other modules.
module.exports = { transcribeAudio };