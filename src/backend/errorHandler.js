// summary-project/src/backend/errorHandler.js
// Module for handling errors and generating user-friendly error messages using the Ollama API.

// Import axios for making HTTP requests to the Ollama API.
const axios = require('axios');


// Async function to summarize an error message into a simple, user-friendly sentence.
async function handleError(errorMessage) {
  try {
    // Define the prompt for Ollama to summarize the error for non-technical users.
    const prompt = `I have this error: "${errorMessage}". Summarize it in one short sentence (under 15 words) for a child or elderly person with no tech knowledge. Focus on why the content can't be accessed or why the error occurred, like age limits or broken links, not technical fixes, login, or password details. For age restrictions, use phrases like "This video is only for adults." to avoid implying user error. Phrase it for an end user, not a developer.`;
    // Send a POST request to the Ollama API to generate the summarized error message.
    const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
      model: 'llama3.2', // Use the LLaMA 3.2 model for text generation.
      prompt: prompt, // Provide the prompt with the error message.
      stream: false, // Disable streaming to receive the full response at once.
      max_tokens: 20 // Limit the response to 20 tokens for brevity.
    });
    // Extract the first line of the response and trim whitespace.
    const summary = response.data.response.trim().split('\n')[0];
    // Log the summarized error message for debugging.
    console.log(`ERROR: ${summary}`);
    // Return the summarized error message.
    return summary;
  } catch (err) {
    // Log any errors that occur during the summarization process for debugging.
    console.error('Error in handleError:', err);
    // Define a fallback error message for end users if summarization fails.
    const fallback = 'Something went wrong. Please try again!';
    // Log the fallback message for debugging.
    console.log(`ERROR: ${fallback}`);
    // Return the fallback message.
    return fallback;
  }
}

// Export the handleError function for use in other modules.
module.exports = { handleError };