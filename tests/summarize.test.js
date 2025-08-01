// summary-project/tests/summarize.test.js
// Unit tests for the summarizeText function using Jest.

// Import the summarizeText function to be tested.
const { summarizeText } = require('../summarize');
// Import axios for mocking HTTP requests.
const axios = require('axios');

// Mock the axios library to simulate API responses during tests.
jest.mock('axios');

// Describe block for grouping tests related to the summarizeText function.
describe('summarizeText', () => {
  // Setup before each test to configure axios mock behavior.
  beforeEach(() => {
    // Mock axios.post to return a resolved promise with a sample response containing bullet points.
    axios.post.mockResolvedValue({
      data: { response: '• First sentence\n• Second sentence\n• Third sentence' }
    });
  });

  // Test case: successful summarization of text into bullet points.
  test('should summarize text into bullet points', async () => {
    // Define a sample input text for summarization.
    const text = 'First sentence. Second sentence. Third sentence.';
    // Call summarizeText with the sample text and await the result.
    const result = await summarizeText(text);
    // Verify that the result contains the first bullet point.
    expect(result).toContain('• First sentence');
    // Verify that the result contains the second bullet point.
    expect(result).toContain('• Second sentence');
    // Verify that the result contains the third bullet point.
    expect(result).toContain('• Third sentence');
  }, 10000); // Set a 10-second timeout for the test to handle potential delays.

  // Test case: handling empty text input.
  test('should handle empty text', async () => {
    // Define an empty input text for summarization.
    const text = '';
    // Call summarizeText with the empty text and await the result.
    const result = await summarizeText(text);
    // Verify that the result is an empty string.
    expect(result).toBe('');
  });

  // Test case: summarization of a single sentence.
  test('should handle single sentence', async () => {
    // Define a single-sentence input text for summarization.
    const text = 'Single sentence.';
    // Mock axios.post to return a resolved promise with a single bullet point response.
    axios.post.mockResolvedValue({
      data: { response: '• Single sentence' }
    });
    // Call summarizeText with the single sentence and await the result.
    const result = await summarizeText(text);
    // Verify that the result contains the single bullet point.
    expect(result).toContain('• Single sentence');
  }, 10000); // Set a 10-second timeout for the test to handle potential delays.
});