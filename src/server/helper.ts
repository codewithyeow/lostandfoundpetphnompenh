import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

export const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    // Server-side: Use next/headers
    const token = cookies().get('token');
    return token ? { Authorization: `Bearer ${token.value}` } : {};
  } else {
    // Client-side: Use js-cookie
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
