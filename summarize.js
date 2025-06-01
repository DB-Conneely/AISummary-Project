// summary-project/summarize.js
// Module for summarizing transcribed text into bullet points using the Ollama API.

// Import axios for making HTTP requests to the Ollama API.
const axios = require('axios');
// Load environment variables from the .env file for secure API URL access.
require('dotenv').config({ path: './.env' });

// Async function to summarize a single text chunk into 3 bullet points using Ollama.
async function summarizeChunk(chunk) {
  // Send a POST request to the Ollama API with the text chunk and summarization parameters.
  const summary = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
    model: 'llama3.2', // Use the LLaMA 3.2 model for summarization.
    prompt: `Summarize this with goals "actions, decisions," 3 bullets only (**NO INTRO OR EXPLANATION TEXT - JUST BULLET POINTS**), under 150 chars total, use £ not $, specific actions only: ${chunk}`, // Prompt to generate 3 bullet points focused on actions/decisions.
    stream: false, // Disable streaming to receive the full response at once.
    max_tokens: 50 // Limit the response to 50 tokens for concise output.
  });
  // Return the summarized bullet points from the API response.
  return summary.data.response;
}

// Async function to split text into chunks and summarize each into bullet points for scalability.
async function summarizeText(text) {
  // Define the maximum size of each text chunk (1500 characters).
  const chunkSize = 1500;
  // Calculate the number of chunks needed based on text length.
  const numChunks = Math.ceil(text.length / chunkSize);
  // Initialize an array to store text chunks.
  const chunks = [];
  // Split the text into chunks of up to 1500 characters each.
  for (let i = 0; i < numChunks; i++) {
    chunks.push(text.slice(i * chunkSize, Math.min((i + 1) * chunkSize, text.length)));
  }
  // Summarize all chunks concurrently using the summarizeChunk function.
  const summaries = await Promise.all(chunks.map(summarizeChunk));
  // Process each summary: split into lines, filter valid bullet points, take up to 3, and join them.
  return summaries.map(summary => summary.split('\n')
    .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) // Keep only lines starting with bullet point markers.
    .slice(0, 3).join('\n')) // Take up to 3 bullet points per chunk and join with newlines.
    .join('\n'); // Combine all chunk summaries into a single string with newlines.
}

// Export the summarizeText function for use in other modules.
module.exports = { summarizeText };