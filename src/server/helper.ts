import { cookies } from 'next/headers';


export const getAuthHeaders = () => {
  const token = cookies().get('token');
  console.log("Auth Token:", token);
  return token ? { Authorization: `Bearer ${token.value}` } : {};
};
