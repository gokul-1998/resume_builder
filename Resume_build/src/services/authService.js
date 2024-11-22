import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this with your backend URL

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // This is important for cookies
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await api.post('/refresh');
                const { access_token } = response.data;
                
                // Store the new access token
                localStorage.setItem('access_token', access_token);
                
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout the user
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('username', response.data.username);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/logout');
            localStorage.removeItem('access_token');
            localStorage.removeItem('username');
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },

    getToken() {
        return localStorage.getItem('access_token');
    },

    getUsername() {
        return localStorage.getItem('username');
    }
};

export default authService;
export { api };
