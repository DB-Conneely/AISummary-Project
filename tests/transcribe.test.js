// summary-project/tests/transcribe.test.js
const { transcribeAudio } = require('../transcribe');
const { AssemblyAI } = require('assemblyai');

jest.mock('assemblyai');

describe('transcribeAudio', () => {
  let mockTranscribe;

  beforeEach(() => {
    mockTranscribe = jest.fn();
    AssemblyAI.mockImplementation(() => ({
      transcripts: {
        transcribe: mockTranscribe
      }
    }));
  });

  test('should transcribe audio successfully', async () => {
    const mockResponse = { status: 'completed', text: 'Test transcription.' };
    mockTranscribe.mockResolvedValue(mockResponse);

    const result = await transcribeAudio('https://test-url.com/audio.m4a');
    expect(result).toBe('Test transcription.');
  });

  test('should handle transcription failure', async () => {
    const mockError = { status: 'error', error: 'Transcription failed' };
    mockTranscribe.mockResolvedValue(mockError);

    await expect(transcribeAudio('https://test-url.com/audio.m4a')).rejects.toThrow('Transcription failed: Transcription failed');
  });

  test('should handle empty transcription', async () => {
    const mockResponse = { status: 'completed', text: '' };
    mockTranscribe.mockResolvedValue(mockResponse);

    const result = await transcribeAudio('https://test-url.com/audio.m4a');
    expect(result).toBe('');
  });
});