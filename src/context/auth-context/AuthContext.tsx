"use client";

import User from "@models/User";
import { remove_cookie, set_cookie } from "@utils/cookie";

import { ApiResponse } from "interfaces";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  AuthContext,
  AuthStatus,
  Login,
  Register,
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
import axios from "@lib/axios";

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

        if (data.success) {
          const user = data.result?.user;
          const token = data.result?.access_token;

          if (token) {
            set_cookie("token", token, { expires: 30 }); // Store token in cookies
          }

          setUser(user);
          setStatus("loggedIn");

          // ✅ Save to localStorage
          localStorage.setItem("authStatus", "loggedIn");
          localStorage.setItem("user", JSON.stringify(user));

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

  const register = useCallback<Register>(
    async (args) => {
      try {
        const { data } = await axios.post(`/api/frontend/auth/register`, {
          email: args.email,
          password: args.password,
          confirm_password: args.confirm_password,
        });

        if (data.success) {
          const user = data.result?.user;
          const token = data.result?.access_token;

          if (token) {
            set_cookie("token", token, { expires: 30 });
          }

          setUser(user);
          setStatus("loggedIn");

          // Save to localStorage
          localStorage.setItem("authStatus", "loggedIn");
          localStorage.setItem("user", JSON.stringify(user));
          console.log(localStorage.getItem("authStatus"));
          console.log(localStorage.getItem("user"));

          return user;
        }
      } catch (error) {
        console.error("Register error:", error);
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
      setStatus("loggedOut");
      remove_cookie("token");
      localStorage.removeItem("authStatus");
      localStorage.removeItem("user");
    }
  }, []);

  const getUser = useCallback<GetUser>(async () => {
    try {
      setLoading(true);

      // 🔹 First, check localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setStatus("loggedIn");
        return JSON.parse(storedUser);
      }

      // 🔹 If no stored user, fetch from API
      const { data }: { data: ApiResponse<User> } = await axios.get(
        `/api/frontend/auth/profile?meta=1`
      );

      if (data.success) {
        const user = data.result;

        setUser(user);
        setStatus("loggedIn");

        localStorage.setItem("authStatus", "loggedIn");
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setStatus("loggedOut");
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
        register,
        logout,
        getUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthContext: UseAuthContext = () => useContext(Context);
