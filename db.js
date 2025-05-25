// summary-project/db.js
// SQLite database module for storing and retrieving meeting data
const sqlite3 = require('sqlite3').verbose(); // Imports SQLite3 with verbose logging

// Initializes SQLite database for storing meeting data
const db = new sqlite3.Database('./minutes.db', (err) => {
  if (err) console.error('DB Error:', err); // Logs database connection errors
  // Creates minutes table if it doesn’t exist
  db.run(
    'CREATE TABLE IF NOT EXISTS minutes (id INTEGER PRIMARY KEY, filename TEXT, text TEXT, bullets TEXT)',
    (err) => {
      if (err) console.error('Error creating table:', err);
      else console.log('Minutes table ready');
    }
  );
});

// Saves meeting data (filename, transcript, bullets) to SQLite
async function saveMeeting(filename, text, bullets) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO minutes (filename, text, bullets) VALUES (?, ?, ?)', // Inserts meeting data
      [filename, text, bullets], // Parameters for filename, transcript, bullets
      (err) => {
        if (err) reject(err); // Rejects on error
        else resolve(); // Resolves on success
      }
    );
  });
}

// Retrieves all meeting data from SQLite
async function getMeetings() {
  return new Promise((resolve, reject) => {
    db.all('SELECT filename, text, bullets FROM minutes', [], (err, rows) => {
      if (err) reject(err); // Rejects on error
      else resolve(rows); // Returns array of meeting records
    });
  });
}

module.exports = { saveMeeting, getMeetings }; // Exports database functions