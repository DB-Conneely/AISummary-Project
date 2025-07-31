// summary-project/tests/transcribe.test.js
// Unit tests for the transcribeAudio function using Jest.

// Import the transcribeAudio function to be tested.
const { transcribeAudio } = require('../transcribe');
// Import the AssemblyAI library for mocking.
const { AssemblyAI } = require('assemblyai');

// Mock the AssemblyAI library to simulate API responses during tests.
jest.mock('assemblyai');

// Describe block for grouping tests related to the transcribeAudio function.
describe('transcribeAudio', () => {
  // Declare a variable to hold the mock transcribe function.
  let mockTranscribe;

  // Setup before each test to reset mocks and configure AssemblyAI behavior.
  beforeEach(() => {
    // Create a mock function for the transcribe method.
    mockTranscribe = jest.fn();
    // Mock the AssemblyAI constructor to return an object with a mock transcribe method.
    AssemblyAI.mockImplementation(() => ({
      transcripts: {
        transcribe: mockTranscribe // Assign the mock transcribe function.
      }
    }));
  });

  // Test case: successful transcription of an audio file.
  test('should transcribe audio successfully', async () => {
    // Define a mock response for a successful transcription.
    const mockResponse = { status: 'completed', text: 'Test transcription.' };
    // Configure the mock transcribe function to resolve with the mock response.
    mockTranscribe.mockResolvedValue(mockResponse);

    // Call transcribeAudio with a test URL and await the result.
    const result = await transcribeAudio('https://test-url.com/audio.m4a');
    // Verify that the result matches the expected transcription text.
    expect(result).toBe('Test transcription.');
  });

  // Test case: handling a transcription failure.
  test('should handle transcription failure', async () => {
    // Define a mock response for a failed transcription.
    const mockError = { status: 'error', error: 'Transcription failed' };
    // Configure the mock transcribe function to resolve with the error response.
    mockTranscribe.mockResolvedValue(mockError);

    // Verify that transcribeAudio rejects with the expected error message.
    await expect(transcribeAudio('https://test-url.com/audio.m4a')).rejects.toThrow('Transcription failed: Transcription failed');
  });

  // Test case: handling an empty transcription result.
  test('should handle empty transcription', async () => {
    // Define a mock response for a completed transcription with no text.
    const mockResponse = { status: 'completed', text: '' };
    // Configure the mock transcribe function to resolve with the empty response.
    mockTranscribe.mockResolvedValue(mockResponse);

    // Call transcribeAudio with a test URL and await the result.
    const result = await transcribeAudio('https://test-url.com/audio.m4a');
    // Verify that the result is an empty string.
    expect(result).toBe('');
  });
});