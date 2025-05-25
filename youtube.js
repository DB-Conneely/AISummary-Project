//summary-project/youtube.js
const youtubedl = require('youtube-dl-exec');

async function downloadYouTube(url, output) {
  await youtubedl(url, {
    extractAudio: true,
    audioFormat: 'm4a',
    output,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    noPlaylist: true,
    noContinue: true
  });
}

module.exports = { downloadYouTube };