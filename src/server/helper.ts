import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

export const getAuthHeaders = () => {
  try {
    let token: string | undefined;

    if (typeof window === "undefined") {
      // Server-side
      const cookie = cookies().get('token');
      token = cookie?.value;
    } else {
      // Client-side
      token = Cookies.get('token');
    }

    if (!token) {
      console.warn('No token found.');
      return {}; // Or throw an error, depending on your needs.
    }

    return { Authorization: `Bearer ${token}` };

  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {}; // Or throw an error.
  }
};