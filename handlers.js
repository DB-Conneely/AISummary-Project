// summary-project/handlers.js
// Module containing core logic for processing uploaded files or YouTube URLs into summaries.

// Import function to download audio from YouTube videos.
const { downloadYouTube } = require('./youtube');
// Import function to upload files to AWS S3.
const { uploadFile } = require('./storage');
// Import function to transcribe audio files.
const { transcribeAudio } = require('./transcribe');
// Import function to summarize transcribed text into bullet points.
const { summarizeText } = require('./summarize');
// Import function to save meeting data to the database.
const { saveMeeting } = require('./db');
// Import promises-based file system module for file operations.
const fs = require('fs').promises;
// Import fluent-ffmpeg for converting video files to audio.
const ffmpeg = require('fluent-ffmpeg');
// Import path module for handling file paths.
const path = require('path');

// Async function to process pre-recorded audio or video inputs (YouTube URLs or uploaded files).
async function handlePreRecorded(input, isFile = false, emitProgress = () => {}) {
  // Initialize audioFile with the input (URL or file path).
  let audioFile = input;
  // Define the temporary directory path for storing intermediate files.
  const tempDir = path.join(__dirname, 'temp');
  // Check if the input is a URL (starts with 'http').
  const isUrl = input.startsWith('http');
  // Flag to determine if temporary file cleanup is needed (for URLs, files, or MP4 inputs).
  const needsTempCleanup = isUrl || isFile || input.endsWith('.mp4');
  // Track the original uploaded file path if input is a file.
  let originalFile = isFile ? input : null;

  try {
    // Start timing the entire processing duration for performance logging.
    console.time('Total Processing');
    // Log the start of audio processing.
    console.log('Processing audio...');

    // Create the temporary directory if it doesn't exist, allowing nested creation.
    await fs.mkdir(tempDir, { recursive: true });

    // Handle YouTube URL input: download the audio.
    if (isUrl) {
      // Start timing the YouTube download process.
      console.time('Download YouTube');
      // Log the start of YouTube audio download.
      console.log('Downloading YouTube audio...');
      // Generate a temporary file path for the downloaded audio.
      audioFile = path.join(tempDir, `temp_${Date.now()}.m4a`);
      // Download the audio from the YouTube URL.
      await downloadYouTube(input, audioFile);
      // End timing for YouTube download.
      console.timeEnd('Download YouTube');
      // Emit progress update to the frontend (25% complete).
      emitProgress('Downloading YouTube audio...', 25);
    } else if (isFile || input.endsWith('.mp4')) {
      // Start timing the MP4 conversion process.
      console.time('Convert MP4');
      // Log the start of MP4 to audio conversion.
      console.log('Converting MP4 to audio...');
      // Generate a temporary file path for the converted audio.
      const tempAudio = path.join(tempDir, `temp_${Date.now()}.m4a`);
      // Convert the input (MP4 or file) to M4A audio using ffmpeg.
      await new Promise((resolve, reject) => {
        ffmpeg(input)
          .output(tempAudio) // Specify the output file path.
          .noVideo() // Exclude video stream, keeping only audio.
          .audioBitrate('32k') // Set audio bitrate to 32kbps for efficiency.
          .on('end', resolve) // Resolve promise when conversion completes.
          .on('error', reject) // Reject promise on conversion error.
          .run(); // Execute the ffmpeg conversion.
      });
      // Update audioFile to point to the converted audio.
      audioFile = tempAudio;
      // End timing for MP4 conversion.
      console.timeEnd('Convert MP4');
      // Emit progress update to the frontend (25% complete).
      emitProgress('Converting MP4 to audio...', 25);

      // Delete the original uploaded file immediately after conversion to save space.
      if (isFile && input) {
        try {
          // Remove the original file from the filesystem.
          await fs.unlink(input);
          // Log successful deletion of the original file.
          console.log(`Deleted original uploaded file after conversion: ${input}`);
          // Clear originalFile to prevent redundant deletion.
          originalFile = null;
        } catch (err) {
          // Log any errors during file deletion for debugging.
          console.error(`Failed to delete original file after conversion ${input}:`, err);
        }
      }
    }

    // Start timing the S3 upload process.
    console.time('Upload S3');
    // Log the start of uploading to S3.
    console.log('Uploading to S3...');
    // Upload the audio file to AWS S3 and get the public URL.
    const s3Url = await uploadFile(audioFile);
    // End timing for S3 upload.
    console.timeEnd('Upload S3');
    // Emit progress update to the frontend (50% complete).
    emitProgress('Uploading to S3...', 50);

    // Delete the temporary audio file immediately after S3 upload to save space.
    if (needsTempCleanup && audioFile !== input) {
      try {
        // Remove the temporary audio file from the filesystem.
        await fs.unlink(audioFile);
        // Log successful deletion of the temporary file.
        console.log(`Deleted temp audio file after S3 upload: ${audioFile}`);
        // Clear audioFile to prevent redundant deletion.
        audioFile = null;
      } catch (err) {
        // Log any errors during file deletion for debugging.
        console.error(`Failed to delete temp file after S3 upload ${audioFile}:`, err);
      }
    }

    // Start timing the transcription process.
    console.time('Transcribe');
    // Log the start of audio transcription.
    console.log('Transcribing audio...');
    // Transcribe the audio using the S3 URL.
    const text = await transcribeAudio(s3Url);
    // End timing for transcription.
    console.timeEnd('Transcribe');
    // Emit progress update to the frontend (75% complete).
    emitProgress('Transcribing audio...', 75);

    // Start timing the summarization process.
    console.time('Summarize');
    // Log the start of text summarization.
    console.log('Summarizing text...');
    // Summarize the transcribed text into bullet points.
    const bullets = await summarizeText(text);
    // End timing for summarization.
    console.timeEnd('Summarize');
    // Emit progress update to the frontend (100% complete).
    emitProgress('Summarizing text...', 100);

    // Save the meeting data (S3 URL, transcript, summary bullets) to the database.
    await saveMeeting(s3Url, text, bullets);
    // End timing for the entire processing duration.
    console.timeEnd('Total Processing');
    // Return the processing results (S3 URL, transcript length, summary bullets).
    return { s3Url, textLength: text.length, bullets };
  } catch (error) {
    // Log any errors during processing for debugging.
    console.error('Error in handlePreRecorded:', error.message);
    // Throw a specific error for file not found, otherwise rethrow the original error.
    throw error.message.includes('ENOENT') ? new Error('File not found.') : error;
  } finally {
    // Clean up the original uploaded file if it still exists.
    if (originalFile) {
      try {
        // Remove the original file from the filesystem.
        await fs.unlink(originalFile);
        // Log successful deletion of the original file.
        console.log(`Deleted original uploaded file in finally: ${originalFile}`);
      } catch (err) {
        // Log any errors during file deletion for debugging.
        console.error(`Failed to delete original file in finally ${originalFile}:`, err);
      }
    }

    // Clean up the specific temporary audio file if it still exists and wasn't the input.
    if (audioFile && audioFile !== input) {
      try {
        // Remove the temporary audio file from the filesystem.
        await fs.unlink(audioFile);
        // Log successful deletion of the temporary file.
        console.log(`Deleted temp audio file in finally: ${audioFile}`);
      } catch (err) {
        // Log any errors during file deletion for debugging.
        console.error(`Failed to delete temp file in finally ${audioFile}:`, err);
      }
    }

    // Ensure the temporary directory is completely empty after processing.
    try {
      // Read the contents of the temporary directory.
      const tempFiles = await fs.readdir(tempDir);
      // Iterate through any remaining files in the temporary directory.
      for (const file of tempFiles) {
        // Construct the full path to the temporary file.
        const filePath = path.join(tempDir, file);
        try {
          // Remove the temporary file from the filesystem.
          await fs.unlink(filePath);
          // Log successful deletion of the temporary file.
          console.log(`Deleted temp file in final cleanup: ${filePath}`);
        } catch (err) {
          // Log any errors during file deletion for debugging.
          console.error(`Failed to delete temp file in final cleanup ${filePath}:`, err);
        }
      }
      // Log successful cleanup of the temporary directory.
      console.log('Temp directory emptied successfully');
    } catch (err) {
      // Log any errors during directory cleanup for debugging.
      console.error(`Failed to empty temp directory:`, err);
    }
  }
}

// Export the handlePreRecorded function for use in other modules.
module.exports = { handlePreRecorded };