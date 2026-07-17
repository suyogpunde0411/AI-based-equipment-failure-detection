import api from './api';

export const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data; // DashboardResponse directly (not wrapped in ApiResponse)
  },
};

export default dashboardService;
