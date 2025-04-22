'use client';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onToggle, isMobile }) {
  // handle logout and then force a redirect
  async function handleLogout(e) {
    e.preventDefault();
    localStorage.clear();
    await fetch('/api/HandleLogout', { method: 'POST' });
    // after server‐side logout, send them to /login
    window.location.href = '/pages/login';
  }

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <button
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label={isOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          {isOpen ? "×" : "☰"}
        </button>

        {isOpen && (
          <>
            <img 
              src="/profile.png"
              alt="App Logo" 
              className={styles.logo}
            />

            <nav className={styles.nav}>
              <a href="/pages/profile" className={styles.link}>Profile</a>
              <a href="/pages/mealplan" className={styles.link}>Meal Plans</a>
              <a href="/pages/workoutplan" className={styles.link}>Workout Plans</a>
              <a href="/pages/userchat" className={styles.link}>Personal Trainer Chat</a>
              <a href="/pages/videocheck" className={styles.link}>Video Form Critique</a>
              <a 
                href="/pages/login" 
                className={styles.link} 
                onClick={handleLogout}
              >
                Log Out
              </a>
            </nav>
          </>
        )}
      </div>
      {isOpen && isMobile && (
        <div 
          className={styles.overlay}
          onClick={onToggle}
        />
      )}
    </>
  );
}
