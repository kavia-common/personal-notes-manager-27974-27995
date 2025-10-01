import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import NotesList from './components/NotesList';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root app component that sets up the Ocean Professional themed shell
   * and renders the notes list. Includes a theme toggle that flips
   * the data-theme attribute for light/dark CSS variables.
   */
  const [theme, setTheme] = useState('light');

  // Apply theme attribute for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App app-shell">
      <Navbar />
      <div className="shell-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <main className="container">
        <NotesList />
      </main>
    </div>
  );
}

export default App;
