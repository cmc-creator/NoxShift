// API Service for NoxShift Backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('noxshift_token');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Authentication APIs
export const authAPI = {
  signup: async (data: { email: string; password: string; name: string; companyName?: string }) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const result = await response.json();
    
    // Store token
    if (result.token) {
      localStorage.setItem('noxshift_token', result.token);
    }
    
    return result;
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    
    // Store token
    if (result.token) {
      localStorage.setItem('noxshift_token', result.token);
    }
    
    return result;
  },

  logout: () => {
    localStorage.removeItem('noxshift_token');
  },

  getCurrentUser: async () => {
    return fetchWithAuth('/auth/me');
  },

  requestPasswordReset: async (email: string) => {
    return fetchWithAuth('/auth/reset-password-request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Employee APIs
export const employeeAPI = {
  getAll: async () => {
    return fetchWithAuth('/employees');
  },

  getById: async (id: string) => {
    return fetchWithAuth(`/employees/${id}`);
  },

  create: async (employee: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    hourlyRate?: number;
    maxHoursPerWeek?: number;
    status?: string;
  }) => {
    return fetchWithAuth('/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  },

  update: async (id: string, employee: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    hourlyRate?: number;
    maxHoursPerWeek?: number;
    status?: string;
  }>) => {
    return fetchWithAuth(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
};

// Schedule/Shift APIs
export const scheduleAPI = {
  getAll: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth(`/schedules${query}`);
  },

  create: async (shift: {
    employeeId: string;
    startTime: string;
    endTime: string;
    position?: string;
    notes?: string;
  }) => {
    return fetchWithAuth('/schedules', {
      method: 'POST',
      body: JSON.stringify(shift),
    });
  },

  update: async (id: string, shift: Partial<{
    employeeId: string;
    startTime: string;
    endTime: string;
    position?: string;
    notes?: string;
    status?: string;
  }>) => {
    return fetchWithAuth(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shift),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`/schedules/${id}`, {
      method: 'DELETE',
    });
  },
};

// Time-off APIs
export const timeoffAPI = {
  getAll: async () => {
    return fetchWithAuth('/timeoff');
  },

  create: async (request: {
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    type?: string;
  }) => {
    return fetchWithAuth('/timeoff', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  update: async (id: string, data: {
    status: string;
    notes?: string;
  }) => {
    return fetchWithAuth(`/timeoff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default {
  auth: authAPI,
  employees: employeeAPI,
  schedules: scheduleAPI,
  timeoff: timeoffAPI,
  healthCheck,
};
