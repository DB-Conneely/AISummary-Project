//summary-project/errorHandler.js
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

async function handleError(errorMessage) {
  try {
    const prompt = `I have this error: "${errorMessage}". Summarize it in one short sentence (under 15 words) for a child or elderly person with no tech knowledge. Focus on why the content can't be accessed or why the error occurred, like age limits or broken links, not technical fixes, login, or password details. For age restrictions, use phrases like "This video is only for adults." to avoid implying user error. Phrase it for an end user, not a developer.`;
    const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
      model: 'llama3.2',
      prompt: prompt,
      stream: false,
      max_tokens: 20
    });
    const summary = response.data.response.trim().split('\n')[0];
    console.log(`ERROR: ${summary}`);
    return summary;
  } catch (err) {
    console.error('Error in handleError:', err);
    const fallback = 'Something went wrong. Please try again!';
    console.log(`ERROR: ${fallback}`);
    return fallback;
  }
}

module.exports = { handleError };