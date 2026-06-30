import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import type { User, Task } from './api';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch {
      // Token is likely invalid or expired
      localStorage.removeItem('task_manager_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search || undefined
      });
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  }, [statusFilter, priorityFilter, search]);

  // Check if authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('task_manager_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  // Fetch tasks whenever filters or authentication change
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const handleAuthSuccess = () => {
    fetchUser();
  };

  const handleLogout = () => {
    localStorage.removeItem('task_manager_token');
    setUser(null);
    setTasks([]);
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Done' ? 'Todo' : 'Done';
    try {
      // Optimistic UI update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      await api.updateTask(id, { status: nextStatus });
      fetchTasks(); // sync back with db
    } catch (err) {
      console.error('Failed to update status', err);
      fetchTasks(); // revert UI in case of failure
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setTasks(prev => prev.filter(t => t.id !== id));
        await api.deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error('Failed to delete task', err);
        fetchTasks();
      }
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
    fetchTasks();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  if (loading) {
    return (
      <div className="app-loader">
        <span className="spinner"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-layout">
        <Navbar user={null} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
        <AuthModal onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />

      <main className="container main-content">
        <StatsDashboard tasks={tasks} />

        {/* Filters and Controls */}
        <div className="controls-panel glass animate-fade-in">
          <div className="search-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search tasks by title, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters-group">
            <div className="filter-select-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by Status"
              >
                <option value="">All Statuses</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Completed</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by Priority"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsFormOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Task Grid / Content */}
        {tasks.length === 0 ? (
          <div className="empty-state-container glass animate-scale-in">
            <div className="empty-icon-wrapper">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
            </div>
            <h3>No tasks found</h3>
            <p>Ready to capture your next big breakthrough? Create a task to get started.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsFormOpen(true)}
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Task Modal */}
      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSave={handleFormSave}
          onClose={handleFormClose}
        />
      )}

      <style>{`
        .app-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .spinner {
          display: inline-block;
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top-color: var(--color-primary);
          animation: spin 1s ease-in-out infinite;
        }

        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 45%),
                      radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 45%);
        }

        .main-content {
          flex: 1;
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .controls-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 460px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-wrapper input {
          padding-left: 2.75rem;
        }

        .filters-group {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .filter-select-wrapper {
          min-width: 140px;
        }

        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .empty-state-container {
          text-align: center;
          padding: 4rem 2rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          max-width: 520px;
          margin: 3rem auto;
        }

        .empty-icon-wrapper {
          color: var(--text-muted);
          background-color: var(--bg-surface-hover);
          padding: 1.25rem;
          border-radius: 50%;
          border: 1px solid var(--border-color);
        }

        .empty-state-container h3 {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .empty-state-container p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          max-width: 380px;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .controls-panel {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-wrapper {
            max-width: none;
          }

          .filters-group {
            flex-wrap: wrap;
          }

          .filter-select-wrapper {
            flex: 1;
            min-width: 120px;
          }

          .filters-group button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
