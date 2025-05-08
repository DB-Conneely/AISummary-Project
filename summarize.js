//sumarize.js
const axios = require('axios');
require('dotenv').config({ path: './.env' });

// Summarises a text chunk into 3 bullet points using Ollama
async function summarizeChunk(chunk) {
  const summary = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
    model: 'llama3.2',
    prompt: `Summarize this with goals "actions, decisions," 3 bullets only (**NO INTRO OR EXPLANATION TEXT - JUST BULLET POINTS**), under 150 chars total, use £ not $, specific actions only: ${chunk}`,
    stream: false,
    max_tokens: 50
  });
  return summary.data.response;
}

// Chunks text and summarises into bullet points, ensuring scalability
async function summarizeText(text) {
  const chunkSize = 1500;
  const numChunks = Math.ceil(text.length / chunkSize);
  const chunks = [];
  for (let i = 0; i < numChunks; i++) {
    chunks.push(text.slice(i * chunkSize, Math.min((i + 1) * chunkSize, text.length)));
  }
  const summaries = await Promise.all(chunks.map(summarizeChunk));
  return summaries.map(summary => summary.split('\n')
    .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
    .slice(0, 3).join('\n')).join('\n');
}

module.exports = { summarizeText };