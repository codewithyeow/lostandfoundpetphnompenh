import User from '@models/User';
import { ApiResponse } from 'interfaces';
import React from 'react';
import { VariantArgs } from 'styled-system';

type RegisterArgs = {
   name: string;
   email?: string;
   password: string;
  
   is_vendor?: boolean;
   captcha_token: string;
   platform: 'website';
};

type ChangePasswordArgs = {
   prefix?: string;
   email?: string;
   captcha_token: string;
   platform: 'website';
};

export type PreRegister = (args: RegisterArgs) => Promise<ApiResponse<any>>;

export type VerifyRegister = (
   args: RegisterArgs & { otp_code: string }
) => Promise<ApiResponse<any>>;

export type Register =(args: {
   name: string;
   email?: string;
   password: string;
   confirm_password: string;
   captcha_token: string;
}) => Promise<User | null | undefined>;

export type Login = (args: {
   email: any;
   password: string;
}) => Promise<User | null | undefined>;

export type Logout = () => Promise<void>;


export type GetUser = () => Promise<User | null | undefined>;

export type UpdateProfile = (args: { name?: string; avatar?: string }) => Promise<boolean>;

export type RequestChangePassword = (args: ChangePasswordArgs) => Promise<ApiResponse<any>>;

export type VerifyResetPassword = (
   args: ChangePasswordArgs & {
      type: string;
      otp_code: string;
   }
) => Promise<ApiResponse<any>>;

export type ResetPassword = (args: {
   password: string;
   token: string;
}) => Promise<ApiResponse<any>>;

export type ChangePassword = (args: {
   current_password: string;
   new_password: string;
}) => Promise<ApiResponse<any>>;

export type AuthStatus = 'loggedOut' | 'loggedIn' | 'registered' ;

export type AuthContext = {
   status: undefined | AuthStatus;
   user?: User | null;
   loading: boolean;
   setUser: (user: User | null) => void;
   setStatus: React.Dispatch<React.SetStateAction<AuthStatus | undefined>>;
   logout: Logout;
   login: Login;
   register: Register
   getUser: GetUser;
};

export type UseAuthContext = () => AuthContext;