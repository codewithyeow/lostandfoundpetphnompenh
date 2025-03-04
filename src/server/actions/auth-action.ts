'use server';

import axios from '@lib/axios';
import { getAuthHeaders } from '@server/helper';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import User from '@models/User';
import { cookies } from 'next/headers';
import { ApiResponse } from 'interfaces';
import { getInitialApiResponse } from '@utils/utils';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const cookieOption: Partial<ResponseCookie> = { maxAge: 30 * 24 * 60 * 60 }; // 30 days

interface Response<T = undefined> {
   status: number;
   error: boolean;
   message?: string;
   data?: T;
}

interface LoginArgs {
   email: string;
   password: string;
}

interface UpdateProfileData {
   name: string;
   avatar?: string;
}

export async function login(args: LoginArgs): Promise<ApiResponse<User>> {
   try {
       const loginEndpoint = `/api/frontend/auth/login`;

       const { data }: { data: ApiResponse<User> } = await axios.post(
           loginEndpoint,
           {
               email: args.email,
               password: args.password,
           },
           { headers: getAuthHeaders() }
       );

       const token = data.result?.access_token;

       if (token) {
           const resCookies = cookies();
           resCookies.set('token', token, cookieOption);
           revalidatePath('/(auth)', 'layout');
       }

       return data;
   } catch (error: any) {
       console.error("Login Error:", error.response?.data); // Debugging

       return {
           success: false,
           title: 'Login Failed',
           code: error.response?.status || 500,
           message: error.response?.data?.message || 'Invalid credentials. Please try again.',
           errors: error.response?.data?.errors || {},
       };
   }
}


export async function logout(): Promise<void> {
   try {
      await axios.post(`/api/frontend/auth/logout`, {}, {
         headers: getAuthHeaders(),
      });
   } catch {
   } finally {
      const resCookies = cookies();
      resCookies.delete('token');
      revalidatePath('/(auth)', 'layout');
   }
}

export async function getUserProfile(): Promise<Response<User>> {
   try {
      const { data }: { data: ApiResponse<User> } = await axios.get(`/api/v1/auth/profile?meta=1`, {
         headers: getAuthHeaders(),
      });

      return {
         error: false,
         status: data.code || 200,
         data: data.result, // Fix: Extract result instead of incorrect data nesting
      };
   } catch (error: any) {
      return {
         error: true,
         status: error.response?.status || 500,
         message:
            error.response?.status === 401
               ? 'Unauthorized'
               : error.response?.data?.message || 'An unexpected error occurred',
      };
   }
}

export async function updateProfile(data: UpdateProfileData): Promise<Omit<Response<any>, 'data'>> {
   try {
      await axios.post(`/api/v1/auth/update`, data, {
         headers: getAuthHeaders(),
      });
      revalidatePath('/profile');
      return {
         error: false,
         status: 200,
      };
   } catch (error: any) {
      return {
         error: true,
         status: error.response?.status || 500,
         message: error.response?.data?.message || 'An unexpected error occurred',
      };
   }
}
