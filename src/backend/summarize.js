// summary-project/src/backend/summarize.js
// Module for summarizing transcribed text into bullet points using the OpenAI API.

// Import the OpenAI SDK for making API requests.
const OpenAI = require('openai');

// Async function to summarize a single text chunk into 3 bullet points using OpenAI.
async function summarizeChunk(chunk) {
  // Initialize the OpenAI client (assumes dotenv loaded in index.js).
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // Send a request to the OpenAI API with the text chunk and summarization parameters.
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Use a lightweight model for cost-efficiency; can switch to 'gpt-4o' for better quality.
    messages: [
      { role: 'system', content: 'You are a helpful assistant that summarizes text into bullet points. think in terms of a minute taker/ administator sitting in on a meeting' },
      { role: 'user', content: `Summarize this with goals "actions, decisions," 3 bullets only (**NO INTRO OR EXPLANATION TEXT - JUST BULLET POINTS**), under 150 chars total, use £ not $, specific actions only: ${chunk}` },
    ],
    max_tokens: 50, // Limit the response to 50 tokens for concise output.
  });
  // Return the summarized bullet points from the API response.
  return completion.choices[0].message.content;
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