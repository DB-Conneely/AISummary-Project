//summary-project/storage.js

const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config({ path: './.env' });

// Initializes AWS S3 client with credentials and region from .env
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Uploads file or buffer to S3 bucket, returns public URL
async function uploadFile(filePathOrBuffer, filename) {
  const fileContent = typeof filePathOrBuffer === 'string' ? fs.readFileSync(filePathOrBuffer) : filePathOrBuffer;
  const key = filename || (typeof filePathOrBuffer === 'string' ? filePathOrBuffer.split('/').pop() : `upload_${Date.now()}.m4a`);
  const params = { Bucket: 'mt-ai-bucket-sk3', Key: key, Body: fileContent };
  const data = await s3.upload(params).promise();
  return data.Location;
}

module.exports = { uploadFile };