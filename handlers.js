//handlers.js
const { downloadYouTube } = require('./youtube');
const { uploadFile } = require('./storage');
const { transcribeAudio } = require('./transcribe');
const { summarizeText } = require('./summarize');
const { saveMeeting } = require('./db');
const fs = require('fs').promises;
const ffmpeg = require('fluent-ffmpeg');

async function handlePreRecorded(input, isFile = false, emitProgress = () => {}) {
  let audioFile = input;
  try {
    console.time('Total Processing');
    console.log('Processing audio...');
    const isUrl = input.startsWith('http');
    if (isUrl) {
      console.time('Download YouTube');
      console.log('Downloading YouTube audio...');
      audioFile = `temp_${Date.now()}.m4a`;
      await downloadYouTube(input, audioFile);
      console.timeEnd('Download YouTube');
      emitProgress('Downloading YouTube audio...', 25);
    } else if (isFile || input.endsWith('.mp4')) {
      console.time('Convert MP4');
      console.log('Converting MP4 to audio...');
      const tempAudio = `temp_${Date.now()}.m4a`;
      await new Promise((resolve, reject) => {
        ffmpeg(input)
          .output(tempAudio)
          .noVideo()
          .audioBitrate('32k')
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
      if (isFile) await fs.unlink(input).catch(() => {});
      audioFile = tempAudio;
      console.timeEnd('Convert MP4');
      emitProgress('Converting MP4 to audio...', 25);
    }

    console.time('Upload S3');
    console.log('Uploading to S3...');
    const s3Url = await uploadFile(audioFile);
    console.timeEnd('Upload S3');
    emitProgress('Uploading to S3...', 50);

    console.time('Transcribe');
    console.log('Transcribing audio...');
    const text = await transcribeAudio(s3Url);
    console.timeEnd('Transcribe');
    emitProgress('Transcribing audio...', 75);

    console.time('Summarize');
    console.log('Summarizing text...');
    const bullets = await summarizeText(text);
    console.timeEnd('Summarize');
    emitProgress('Summarizing text...', 100);

    if (isUrl || isFile || input.endsWith('.mp4')) {
      console.log('Deleting temp file...');
      await fs.unlink(audioFile).catch(() => {});
    }

    await saveMeeting(audioFile, text, bullets);
    console.timeEnd('Total Processing');
    return { s3Url, textLength: text.length, bullets };
  } catch (error) {
    console.error('Error in handlePreRecorded:', error.message);
    if (audioFile && (isUrl || isFile || input.endsWith('.mp4'))) {
      await fs.unlink(audioFile).catch(() => {});
    }
    throw error.message.includes('ENOENT') ? new Error('File not found.') : error;
  }
}

module.exports = { handlePreRecorded };