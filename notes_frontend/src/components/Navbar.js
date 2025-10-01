import React from 'react';

/**
 * Navbar with Ocean Professional styling.
 */
// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with app title. */
  return (
    <nav className="navbar-op">
      <div className="navbar-container">
        <div className="brand">
          <span className="brand-accent">✦</span>
          <span className="brand-title">Personal Notes</span>
        </div>
        <div className="nav-actions">
          <span className="env-hint">Ocean Professional</span>
        </div>
      </div>
    </nav>
  );
}
