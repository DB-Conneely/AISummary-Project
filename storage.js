// summary-project/storage.js
// Module for uploading files to AWS S3 and retrieving public URLs.

// Import the AWS SDK for interacting with S3 services.
const AWS = require('aws-sdk');
// Import the file system module for reading local files.
const fs = require('fs');
// Load environment variables from the .env file for secure AWS credentials.
require('dotenv').config({ path: './.env' });

// Initialize AWS S3 client with credentials and region from environment variables.
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS access key ID from .env.
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS secret access key from .env.
  region: process.env.AWS_REGION // AWS region from .env (e.g., eu-west-2).
});

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