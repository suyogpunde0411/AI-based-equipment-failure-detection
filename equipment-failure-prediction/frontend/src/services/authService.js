import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Response contains ApiResponse<AuthResponse> => { success, message, data: { token, tokenType, userId, fullName, email, role } }
  },

  register: async (fullName, email, password, role = 'ENGINEER') => {
    const response = await api.post('/auth/register', { fullName, email, password, role });
    return response.data; // ApiResponse<UserResponse>
  },
};

export default authService;
