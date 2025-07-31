// summary-project/src/backend/youtube.js
// Module for downloading audio from YouTube videos using youtube-dl-exec.

// Import the youtube-dl-exec library for downloading YouTube audio.
const youtubedl = require('youtube-dl-exec');

// Async function to download audio from a YouTube video URL and save it to the specified output path.
async function downloadYouTube(url, output) {
  // Execute youtube-dl-exec to download the audio with specified options.
  await youtubedl(url, {
    extractAudio: true, // Extract only the audio stream from the video.
    audioFormat: 'm4a', // Save the audio in M4A format.
    output, // Specify the output file path for the downloaded audio.
    noCheckCertificates: true, // Skip SSL certificate verification for compatibility.
    noWarnings: true, // Suppress warning messages during download.
    preferFreeFormats: true, // Prioritize open-source formats for the audio.
    noPlaylist: true, // Download only the specified video, not a playlist.
    noContinue: true // Do not resume partial downloads, ensuring a fresh download.
  });
}

// Export the downloadYouTube function for use in other modules.
module.exports = { downloadYouTube };