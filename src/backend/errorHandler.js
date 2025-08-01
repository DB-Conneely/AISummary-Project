// summary-project/src/backend/errorHandler.js
// Module for handling errors and generating user-friendly error messages using the OpenAI API.

// Import the OpenAI SDK for making API requests.
const OpenAI = require('openai');

// Async function to summarize an error message into a simple, user-friendly sentence.
async function handleError(errorMessage) {
  try {
    // Initialize the OpenAI client with the API key from environment variables.
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Define the prompt for OpenAI to summarize the error for non-technical users.
    const prompt = `I have this technical error: "${errorMessage}". Summarize it in one short sentence (under 10 words - the shorter the better) for anyone any age with no technical knowledge. Focus on why the content can't be accessed or why the error occurred, like age limits or broken links. Not technical fixes, login, or password details. For age restrictions, use phrases like "This video is only for adults." to avoid implying user error (this is just an example, but should but similar responses should be applied depending on context). Phrase it for an end user, not a developer. this Error message will directly face the user of the application and therefore should fit this context.`;

    // Send a request to the OpenAI API with the error message and summarization parameters.
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant creating simple error messages for non-technical users.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 20, // Limit the response to 20 tokens for brevity.
    });

    // Extract the first line of the response and trim whitespace.
    const summary = completion.choices[0].message.content.trim().split('\n')[0];

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