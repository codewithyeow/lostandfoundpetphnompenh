import axios, { AxiosError, CancelTokenSource } from 'axios';
import { get_cookie, remove_cookie } from '@utils/cookie';
import canUseDOM from '@utils/canUseDOM';

const cancelTokens: Map<string, CancelTokenSource> = new Map();
const TIMEOUT = 15000;

const axiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
   },
   timeout: TIMEOUT,
});

axiosInstance.interceptors.request.use(
   (config) => {
      if (canUseDOM) {
         config.headers['Accept-Language'] = get_cookie('locale') ?? 'en';
         const token = get_cookie('token');
         if (token) {
            config.headers.Authorization = `Bearer ${token}`;
         }
      }

      const source = axios.CancelToken.source();
      config.cancelToken = source.token;

      const requestKey = config.url + JSON.stringify(config.params);
      cancelTokens.set(requestKey, source);

      setTimeout(() => {
         if (cancelTokens.has(requestKey)) {
            source.cancel('Request auto-canceled due to timeout.');
            cancelTokens.delete(requestKey);
         }
      }, TIMEOUT);

      return config;
   },
   (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
   (response) => {
      const requestKey = response.config.url + JSON.stringify(response.config.params);
      cancelTokens.get(requestKey)?.cancel();
      cancelTokens.delete(requestKey);

      return response;
   },
   (error: AxiosError) => {
      if (error.response?.status && [401, 403].includes(error.response.status) && canUseDOM) {
         remove_cookie('token');
         remove_cookie('user');
      }
      return Promise.reject(error);
   }
);

export default axiosInstance;
