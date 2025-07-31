// summary-project/frontend/src/index.js
// Main entry point for the React frontend application.

// Import React library, essential for building UI components.
import React from 'react';
// Import ReactDOM for rendering React components to the DOM.
import ReactDOM from 'react-dom/client';
// Import the main App component, which is the root of the application's component tree.
import App from './app';

// Create a React root to manage updates to the DOM.
// It targets the HTML element with the ID 'root' in index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component inside the created React root.
root.render(<App />);