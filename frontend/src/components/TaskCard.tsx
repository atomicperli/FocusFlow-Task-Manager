import React from 'react';
import type { Task } from '../api';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, currentStatus: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'badge-low';
      case 'high': return 'badge-high';
      default: return 'badge-medium';
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done';

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const tagsList = task.tags ? task.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className={`task-card glass animate-fade-in ${task.status === 'Done' ? 'task-completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-checkbox-container">
          <button 
            type="button"
            className={`custom-checkbox ${task.status === 'Done' ? 'checked' : ''}`}
            onClick={() => onStatusChange(task.id, task.status)}
            aria-label="Toggle task status"
          >
            {task.status === 'Done' && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <span className="priority-dot" style={{ backgroundColor: `var(--priority-${task.priority.toLowerCase()})` }} />
          <h3 className="task-title">{task.title}</h3>
        </div>
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {tagsList.length > 0 && (
        <div className="task-tags">
          {tagsList.map((tag, idx) => (
            <span key={idx} className="tag-pill">#{tag}</span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        {task.due_date ? (
          <div className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{isOverdue ? 'Overdue: ' : ''}{formatDueDate(task.due_date)}</span>
          </div>
        ) : (
          <div className="task-due-date-placeholder">No due date</div>
        )}

        <div className="task-actions">
          <button 
            type="button" 
            className="action-btn edit-btn" 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
            </svg>
          </button>
          <button 
            type="button" 
            className="action-btn delete-btn" 
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .task-card {
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
        }

        .task-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-color-hover);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.4);
        }

        .task-completed {
          opacity: 0.65;
        }

        .task-completed .task-title {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .task-checkbox-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .custom-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid var(--text-muted);
          border-radius: 6px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .custom-checkbox:hover {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-glow);
        }

        .custom-checkbox.checked {
          background-color: var(--color-success);
          border-color: var(--color-success);
        }

        .priority-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .task-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .task-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          word-break: break-word;
          line-height: 1.4;
        }

        .task-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .tag-pill {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-size: 0.75rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .task-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
          margin-top: auto;
          font-size: 0.8rem;
        }

        .task-due-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-secondary);
        }

        .task-due-date.overdue {
          color: var(--color-danger);
          font-weight: 500;
        }

        .task-due-date-placeholder {
          color: var(--text-muted);
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .delete-btn:hover {
          color: var(--color-danger);
          background-color: var(--color-danger-glow);
        }
      `}</style>
    </div>
  );
};
