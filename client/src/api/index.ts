import axios from 'axios';

export const API_URL = process.env.API_URL || 'http://localhost:5000';

export const $api = axios.create({
    withCredentials: true, 
    baseURL: API_URL
});

$api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.config && !originalRequest._isRetry && originalRequest.url !== '/auth/refresh') {
            originalRequest._isRetry = true;
            try {
                await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                return $api.request(originalRequest);
            } catch (e) {
                throw e;
            }
        }
        throw error; 
    }
);