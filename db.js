//db.js
const sqlite3 = require('sqlite3').verbose();

// Initializes SQLite database for storing meeting data
const db = new sqlite3.Database('./minutes.db', (err) => {
  if (err) console.error('DB Error:', err);
  // Creates minutes table if it doesn’t exist
  db.run('CREATE TABLE IF NOT EXISTS minutes (id INTEGER PRIMARY KEY, filename TEXT, transcript TEXT, bullets TEXT)');
});

// Saves meeting data (filename, transcript, bullets) to SQLite
async function saveMeeting(filename, transcript, bullets) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO minutes (filename, transcript, bullets) VALUES (?, ?, ?)', 
      [filename, transcript, bullets], (err) => {
        if (err) reject(err);
        else resolve();
      });
  });
}

module.exports = { saveMeeting };