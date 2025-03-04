// src/config/api_client.ts
import axios from 'axios';
import { BASE_URL } from './env';
import { get_cookie } from '@utils/cookie';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Accept-Language': typeof window !== 'undefined' ? get_cookie('locale') || 'en' : 'en',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = get_cookie('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
