import React from 'react';
import type { User } from '../api';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <div className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <span className="logo-text">FocusFlow</span>
        </div>

        <div className="nav-actions-wrapper">
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={onToggleTheme} 
            aria-label="Toggle theme mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {user && (
            <div className="nav-user-actions">
              <div className="user-profile">
                <div className="user-avatar">
                  {user.email.substring(0, 2).toUpperCase()}
                </div>
                <span className="user-email">{user.email}</span>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0.875rem 0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .logo-icon {
          color: var(--color-primary);
          filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.4));
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-actions-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .theme-toggle-btn {
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .theme-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: var(--border-color-hover);
          transform: scale(1.05);
        }

        :root.light-theme .theme-toggle-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .nav-user-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border-left: 1px solid var(--border-color);
          padding-left: 1rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
        }

        .user-email {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .user-email {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
