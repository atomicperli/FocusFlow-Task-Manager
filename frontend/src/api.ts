const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface User {
  id: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  tags: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

class ApiService {
  private getHeaders(authRequired = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authRequired) {
      const token = localStorage.getItem('task_manager_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}, authRequired = true): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getHeaders(authRequired),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.detail || 'Something went wrong';
      throw new Error(message);
    }

    return response.json();
  }

  // Auth APIs
  async signup(email: string, password: string): Promise<User> {
    return this.request<User>('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/login-json', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
  }

  async getMe(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Task APIs
  async getTasks(filters?: { status?: string; priority?: string; search?: string }): Promise<Task[]> {
    let queryParams = '';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status_filter', filters.status);
      if (filters.priority) params.append('priority_filter', filters.priority);
      if (filters.search) params.append('search', filters.search);
      const queryString = params.toString();
      if (queryString) queryParams = `?${queryString}`;
    }
    return this.request<Task[]>(`/tasks${queryParams}`);
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;
