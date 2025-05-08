// summary-project/index.js
// Node.js module for pre-recorded audio processing in an AI meeting summarizer SaaS
require('dotenv').config({ path: './.env' }); // Fixed path to .env
const { transcribeAudio } = require('./transcribe');
const { summarizeText } = require('./summarize');
const { saveMeeting } = require('./db');
const { uploadFile } = require('./storage');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec');
const readline = require('readline');

// Processes pre-recorded audio (YouTube URLs or local files) with transcription and summarization
async function handlePreRecorded(input) {
  try {
    console.time('Total Processing');
    console.log('Processing audio...'); // Status message
    let audioFile = input;
    const isUrl = input.startsWith('http');
    if (isUrl) {
      console.time('Download YouTube');
      console.log('Downloading YouTube audio...');
      audioFile = `temp_${Date.now()}.m4a`;
      await youtubedl(input, {
        extractAudio: true,
        audioFormat: 'm4a',
        output: audioFile,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        noPlaylist: true,
        noContinue: true
      });
      console.timeEnd('Download YouTube');
    } else if (input.endsWith('.mp4')) {
      console.time('Convert MP4');
      console.log('Converting MP4 to audio...');
      const ffmpeg = require('fluent-ffmpeg');
      const tempAudio = `temp_${Date.now()}.m4a`;
      await new Promise((resolve, reject) => {
        ffmpeg(input).output(tempAudio).noVideo().audioBitrate('32k').on('end', resolve).on('error', reject).run();
      });
      audioFile = tempAudio;
      console.timeEnd('Convert MP4');
    }
    console.time('Upload S3');
    console.log('Uploading to S3...');
    const s3Url = await uploadFile(audioFile);
    console.timeEnd('Upload S3');
    console.time('Transcribe');
    console.log('Transcribing audio...');
    const text = await transcribeAudio(audioFile);
    console.timeEnd('Transcribe');
    if (isUrl || input.endsWith('.mp4')) {
      console.log('Deleting temp file...');
      fs.unlinkSync(audioFile);
    }
    console.time('Summarize');
    console.log('Summarizing text...');
    const bullets = await summarizeText(text);
    console.timeEnd('Summarize');
    await saveMeeting(audioFile, text, bullets);
    // Clean output
    console.log(`S3 URL: ${s3Url}`);
    console.log(`Transcription length: ${text.length} characters`);
    console.log('\nSummary:');
    bullets.split('\n').filter(Boolean).forEach(bullet => console.log(bullet));
    console.timeEnd('Total Processing');
  } catch (error) {
    console.error('Error in handlePreRecorded:', error.message);
    throw error;
  }
}

// CLI handler for running PRE mode directly from terminal
const audioFile = process.argv[2];
if (audioFile) {
  (async () => {
    console.time('Total Processing-CLI');
    try {
      const s3Url = await uploadFile(audioFile);
      const text = await transcribeAudio(audioFile);
      console.log(`Transcription (${audioFile}):`, text);
      console.log(`S3 URL: ${s3Url}`);
      console.log(`Stats (${audioFile}): ${text.length} chars, ${text.split(/\s+/).length} words`);
      const bullets = await summarizeText(text);
      await saveMeeting(audioFile, text, bullets);
      console.log(`Summary (${audioFile}):`, bullets);
      console.timeEnd('Total Processing-CLI');
    } catch (err) {
      console.error('Error in CLI handler:', err.message);
    }
  })();
}

// Interactive CLI prompt for selecting PRE mode and input
async function runPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter file path or YouTube URL (e.g., ./5min_far.m4a or https://youtube.com/...): ', async input => {
    await handlePreRecorded(input);
    rl.close();
  });
}
runPrompt();