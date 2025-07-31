// summary-project/src/backend/db.js
// Module for managing SQLite database operations to store and retrieve meeting summaries.

// Import SQLite3 with verbose logging for detailed error messages.
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database connection to 'minutes.db' file.
const db = new sqlite3.Database('./minutes.db', (err) => {
  // Log any errors that occur during database connection.
  if (err) console.error('DB Error:', err);
  // Create the 'minutes' table if it does not already exist.
  db.run(
    'CREATE TABLE IF NOT EXISTS minutes (id INTEGER PRIMARY KEY, filename TEXT, text TEXT, bullets TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
    (err) => {
      // Log any errors that occur during table creation.
      if (err) console.error('Error creating table:', err);
      // Log confirmation when the table is ready.
      else console.log('Minutes table ready');
    }
  );
});

// Async function to save meeting data (S3 URL, transcript, and summary bullets) to the SQLite database.
async function saveMeeting(filename, text, bullets) {
  // Return a Promise to handle asynchronous database insertion.
  return new Promise((resolve, reject) => {
    // Execute SQL INSERT to add meeting data to the 'minutes' table.
    db.run(
      'INSERT INTO minutes (filename, text, bullets) VALUES (?, ?, ?)', // SQL query to insert data.
      [filename, text, bullets], // Parameters: S3 URL (filename), transcript, and summary bullets.
      (err) => {
        // Reject the Promise with the error if insertion fails.
        if (err) reject(err);
        // Resolve the Promise on successful insertion.
        else resolve();
      }
    );
  });
}

// Async function to retrieve all meeting summaries from the SQLite database.
async function getMeetings() {
  // Return a Promise to handle asynchronous database query.
  return new Promise((resolve, reject) => {
    // Execute SQL SELECT to fetch all records from the 'minutes' table.
    db.all('SELECT filename, text, bullets, created_at FROM minutes ORDER BY created_at DESC', [], (err, rows) => {
      // Reject the Promise with the error if the query fails.
      if (err) reject(err);
      // Resolve the Promise with the array of meeting records.
      else resolve(rows);
    });
  });
}

// Export the saveMeeting and getMeetings functions for use in other modules.
module.exports = { saveMeeting, getMeetings };