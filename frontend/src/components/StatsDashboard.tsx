import React from 'react';
import type { Task } from '../api';

interface StatsDashboardProps {
  tasks: Task[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const todo = tasks.filter(t => t.status === 'Todo').length;
  
  const overdue = tasks.filter(t => {
    return t.due_date && new Date(t.due_date) < new Date() && t.status !== 'Done';
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid animate-fade-in">
      <div className="stat-card glass">
        <div className="stat-icon-wrapper total-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Tasks</span>
          <h3 className="stat-value">{total}</h3>
        </div>
      </div>

      <div className="stat-card glass">
        <div className="stat-icon-wrapper success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed</span>
          <div className="stat-value-group">
            <h3 className="stat-value">{completed}</h3>
            <span className="stat-percentage">{completionRate}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="stat-card glass">
        <div className="stat-icon-wrapper progress-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">In Progress</span>
          <h3 className="stat-value">{inProgress}</h3>
        </div>
      </div>

      <div className="stat-card glass">
        <div className="stat-icon-wrapper warning-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Todo / Pending</span>
          <h3 className="stat-value">{todo}</h3>
        </div>
      </div>

      {overdue > 0 && (
        <div className="stat-card glass overdue-stat-card">
          <div className="stat-icon-wrapper danger-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label overdue-label">Overdue Tasks</span>
            <h3 className="stat-value overdue-value">{overdue}</h3>
          </div>
        </div>
      )}

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-color-hover);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .total-icon {
          background-color: var(--color-primary-glow);
          color: var(--color-primary);
        }

        .success-icon {
          background-color: var(--color-success-glow);
          color: var(--color-success);
        }

        .progress-icon {
          background-color: rgba(6, 182, 212, 0.15);
          color: var(--color-info);
        }

        .warning-icon {
          background-color: var(--color-warning-glow);
          color: var(--color-warning);
        }

        .danger-icon {
          background-color: var(--color-danger-glow);
          color: var(--color-danger);
        }

        .overdue-stat-card {
          border-color: rgba(239, 68, 68, 0.3);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.15);
        }

        .stat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .overdue-label {
          color: var(--priority-high);
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .overdue-value {
          color: var(--priority-high);
        }

        .stat-value-group {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .stat-percentage {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-success);
        }

        .progress-bar-bg {
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-top: 0.25rem;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: var(--color-success);
          border-radius: var(--radius-full);
          transition: width var(--transition-normal);
        }
      `}</style>
    </div>
  );
};
