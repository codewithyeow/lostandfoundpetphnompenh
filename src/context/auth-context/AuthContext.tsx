
'use client';

import User from '@models/User';
import { remove_cookie, set_cookie } from '@utils/cookie';

import { ApiResponse } from 'interfaces';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type {
  AuthContext,
  AuthStatus,
  Login,
  Logout,
  PreRegister,
  VerifyRegister,
  ChangePassword,
  UpdateProfile,
  UseAuthContext,
  RequestChangePassword,
  VerifyResetPassword,
  ResetPassword,
  GetUser,
} from "../types";
import axios from '@lib/axios';

const Context = createContext({} as AuthContext);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const [status, setStatus] = useState<AuthStatus>("loggedOut");


  const login = useCallback<Login>(
    async (args) => {
      try {
        const { data }: { data: ApiResponse<User> } = await axios.post(
          `/api/frontend/auth/login`,
          {
            email: args.email,
            password: args.password,
          }
        );
  
        if (data.success) {  // Use 'success' instead of 'status'
          const user = data.result?.user; // Extract user from 'result'
          const token = data.result?.access_token; // Extract token from 'result'
          
          if (token) {
            set_cookie("token", token, { expires: 30 });
          }
  
          setUser(user);
          setStatus("loggedIn");  
  
          return user;
        } else {
          throw new Error(data.message || "Login failed");
        }
      } catch (error) {
        throw error;
      }
    },
    [setUser, setStatus]
  );
  
  

  const logout = useCallback<Logout>(async () => {
    try {
      await axios.post(`/api/frontend/auth/logout`);
    } catch {
    } finally {
       setUser(null);
       setStatus('loggedOut');
       remove_cookie('token');
       remove_cookie('user');
       localStorage.clear();
    }
 }, []);


 const getUser = useCallback<GetUser>(async () => {
  try {
    setLoading(true);
    const { data }: { data: ApiResponse<User> } = await axios.get(
      `/api/frontend/auth/profile?meta=1`
    );

    if (data.success) { 
      const user = data.result; 
      
      setUser(user);
      setStatus('loggedIn');
    } else {
      setStatus('loggedOut');
    }

    return data.result;
  } catch {
    setStatus("loggedOut");
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    getUser();
  }, [getUser]);
  return (
    <Context.Provider
      value={{
        status,
        user,
        loading,
        setUser,
        setStatus,
        login,
        logout,
        getUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthContext: UseAuthContext = () => useContext(Context);
