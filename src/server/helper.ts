import { cookies } from 'next/headers';

// Ensure the correct headers are being retrieved and added
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    Authorization: `Bearer ${token}`, 
    'Content-Type': 'application/json', 
    Accept: 'application/json', 
  };
};
