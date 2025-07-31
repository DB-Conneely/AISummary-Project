// summary-project/src/backend/storage.js
// Module for uploading files to AWS S3 and retrieving public URLs.

// Import the AWS SDK for interacting with S3 services.
const AWS = require('aws-sdk');
// Import the file system module for reading local files.
const fs = require('fs');
// Explicitly update AWS config to force credential and region loading (tidy fix for old SDK).
console.log('Loaded AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Yes (masked: ' + process.env.AWS_ACCESS_KEY_ID.slice(0, 5) + '...)' : 'Undefined!');
console.log('Loaded AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Yes (masked: ' + process.env.AWS_SECRET_ACCESS_KEY.slice(0, 5) + '...)' : 'Undefined!');
console.log('Loaded AWS_REGION:', process.env.AWS_REGION || 'Undefined!');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Initialize AWS S3 client with credentials and region from environment variables.
const s3 = new AWS.S3();

// Async function to upload a file or buffer to an S3 bucket and return its public URL.
async function uploadFile(filePathOrBuffer, filename) {
  // Determine file content: read from file path if string, otherwise use buffer directly.
  const fileContent = typeof filePathOrBuffer === 'string' ? fs.readFileSync(filePathOrBuffer) : filePathOrBuffer;
  // Generate S3 key: use provided filename, extract from path, or create timestamp-based name for buffers.
  const key = filename || (typeof filePathOrBuffer === 'string' ? filePathOrBuffer.split('/').pop() : `upload_${Date.now()}.m4a`);
  // Define S3 upload parameters: bucket name, key, and file content.
  const params = { Bucket: 'mt-ai-bucket-sk3', Key: key, Body: fileContent };
  // Upload the file to S3 and await the response.
  const data = await s3.upload(params).promise();
  // Return the public URL of the uploaded file.
  return data.Location;
}

// Export the uploadFile function for use in other modules.
module.exports = { uploadFile };