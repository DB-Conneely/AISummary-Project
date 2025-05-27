// summary-project/tests/summarize.test.js
const { summarizeText } = require('../summarize');
const axios = require('axios');

jest.mock('axios');

describe('summarizeText', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: { response: '• First sentence\n• Second sentence\n• Third sentence' }
    });
  });

  test('should summarize text into bullet points', async () => {
    const text = 'First sentence. Second sentence. Third sentence.';
    const result = await summarizeText(text);
    expect(result).toContain('• First sentence');
    expect(result).toContain('• Second sentence');
    expect(result).toContain('• Third sentence');
  }, 10000);

  test('should handle empty text', async () => {
    const text = '';
    const result = await summarizeText(text);
    expect(result).toBe('');
  });

  test('should handle single sentence', async () => {
    const text = 'Single sentence.';
    axios.post.mockResolvedValue({
      data: { response: '• Single sentence' }
    });
    const result = await summarizeText(text);
    expect(result).toContain('• Single sentence');
  }, 10000);
});