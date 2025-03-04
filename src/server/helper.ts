import { cookies } from 'next/headers';


// Helper function to get authorization header with the token in server component
export const getAuthHeaders = () => {
   const token = cookies().get('token');
   return {
      Authorization: `Bearer ${token?.value}`,
   };
};
