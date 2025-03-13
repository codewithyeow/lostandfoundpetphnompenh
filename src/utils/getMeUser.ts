import axios from '@lib/axios';
import User from '@models/User';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getMeUser(args?: {
   nullUserRedirect?: string;
   validUserRedirect?: string;
}): Promise<{
   user: User | null | undefined;
   token: string | null | undefined;
} | void> {
   const { nullUserRedirect, validUserRedirect } = args || {};

   const cookieStore = cookies();
   const token = cookieStore.get('token')?.value;

   const user = await axios
      .get(`/api/frontend/auth/profile?meta=1`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      .then((data) => ({
         ...data.data.item,
         meta: data.data?.meta,
      }))
      .catch(() => {
         if (nullUserRedirect) redirect(nullUserRedirect);
         return null;
      });

   if (validUserRedirect && user) redirect(validUserRedirect);

   return { user, token };
}
