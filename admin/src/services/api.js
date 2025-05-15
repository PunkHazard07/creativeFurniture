import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
});

// Add request interceptor to attach auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Dashboard API services
export const dashboardService = {
  // Get all dashboard metrics
  getDashboardMetrics: async (timePeriod = 'weekly', ordersPage = 1, productsPage = 1, pageSize = 5) => {
    try {
      const response = await api.get(
        `/dashMetrics?timePeriod=${timePeriod}&ordersPage=${ordersPage}&productsPage=${productsPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  // Get specific metric
  getSpecificMetric: async (metricType, timePeriod = 'weekly') => {
    try {
      const response = await api.get(`/metrics/${metricType}?timePeriod=${timePeriod}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${metricType} metrics:`, error);
      throw error;
    }
  }
};

export default api;