import { cookies } from 'next/headers';


export const getAuthHeaders = () => {
   const token = cookies().get('token');
   return {
      Authorization: `Bearer ${token?.value}`,
   };
};