"use client";

import User from "@models/User";
import { remove_cookie, set_cookie } from "@utils/cookie";
import { toast } from "react-toastify";
import { ApiResponse } from "interfaces";
import { verifyOTP as verifyOtpAction } from "@server/actions/auth-action";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
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
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loggedOut");

  const sendOtp = useCallback<RequestChangePassword>(
    async (args) => {
      // ... (your existing sendOtp implementation)
      try {
        setLoading(true);
        if (!args.email) {
          throw new Error("Email is required to send OTP.");
        }

        const {
          data,
        }: {
          data: ApiResponse<{
            verify_token: string;
            expires_in: number;
            email: string;
          }>;
        } = await axios.post(
          `/api/frontend/auth/send-otp?email=${encodeURIComponent(args.email)}`
        );

        if (data.success && data.result) {
          const { verify_token, expires_in, email } = data.result;
          localStorage.setItem("verify_token", verify_token);
          return {
            success: true,
            status: 200,
            title: "OK",
            code: 200,
            message: data.message || "OTP sent successfully.",
            result: { verify_token, expires_in, email },
          };
        } else {
          throw new Error(data.message || "Failed to send OTP. Try again.");
        }
      } catch (error: any) {
        console.error("Send OTP Error:", error);
        return {
          success: false,
          status: error.response?.status || 400,
          title: "Error",
          code: error.response?.status || 400,
          message:
            error.response?.data?.message ||
            "Failed to send OTP. Please try again.",
          result: null,
          errors: error.response?.data?.errors || {},
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const verifyOtp = useCallback<VerifyResetPassword>(
    async (args) => {
      // ... (your existing verifyOtp implementation)
      try {
        setLoading(true);
        const verify_token = localStorage.getItem("verify_token");

        if (!args.otp_code || !verify_token || !args.email) {
          throw new Error("OTP code and email are required.");
        }
        const response = await verifyOtpAction({
          otp: args.otp_code,
          verify_token: verify_token,
          email: args.email,
        });

        if (response.success === false) {
          toast.error(response.message || "Failed to verify OTP.");
          return {
            success: false,
            title: "Error",
            code: response.status || 400,
            status: response.status || 400,
            message: response.message || "Failed to verify OTP.",
            result: null,
          };
        }

        if (response.result?.reset_token) {
          localStorage.setItem("reset_token", response.result.reset_token);
        }

        localStorage.removeItem("verify_token");
        toast.success(response.message || "OTP verified successfully.");
        return {
          success: true,
          status: response.status || 200,
          title: "Success",
          code: response.status || 200,
          message: response.message || "OTP verified successfully.",
          result: response.result,
        };
      } catch (error: any) {
        console.error("Error verifying OTP:", error);
        return {
          success: false,
          status: 500,
          title: "Error",
          code: 500,
          message:
            error.message || "An unexpected error occurred while verifying OTP.",
          result: null,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback<ResetPassword>(
    async (args) => {
      try {
        const { newPassword, confirmPassword, token } = args;

        const result = await axios.post(`/api/frontend/auth/reset-password`, {
          new_password: newPassword,
          confirm_password: confirmPassword,
          reset_token: token,
        });

        if (result.data.success) {
          localStorage.removeItem("reset_token");
          toast.success("Password reset successfully!");
          return {
            success: true,
            status: 200,
            title: "Success",
            code: 200,
            message: "Password reset successfully.",
            result: null,
          };
        } else {
          throw new Error(result.data.message || "Failed to reset password.");
        }
      } catch (error: any) {
        toast.error(error.message || "Error resetting password.");
        return {
          success: false,
          status: error.response?.status || 500,
          title: "Error",
          code: error.response?.status || 500,
          message: error.message || "Error resetting password.",
          result: null,
        };
      }
    },
    []
  );

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
          const user = data.result?.user; // User | undefined
          const token = data.result?.access_token;

          if (token) {
            set_cookie("token", token, { expires: 30 });
          }

          // Handle undefined user case
          setUser(user || null); // Convert undefined to null
          setStatus("loggedIn");
          localStorage.setItem("authStatus", "loggedIn");
          localStorage.setItem("user", JSON.stringify(user || null)); // Store null if user is undefined
          return user || null; // Return null if user is undefined
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
          name: args.name,
          email: args.email,
          password: args.password,
          confirm_password: args.confirm_password,
          captcha_token: args.captcha_token,
        });

        if (data.success) {
          const user = data.result?.user; // User | undefined
          const token = data.result?.access_token;

          if (token) {
            set_cookie("token", token, { expires: 30 });
          }

          // Handle undefined user case
          setUser(user || null); // Convert undefined to null
          setStatus("loggedIn");
          localStorage.setItem("authStatus", "loggedIn");
          localStorage.setItem("user", JSON.stringify(user || null)); // Store null if user is undefined
          return user || null; // Return null if user is undefined
        }
      } catch (error) {
        console.error("Register error:", error);
        throw error;
      }
    },
    [setUser, setStatus]
  );

  const getUser = useCallback<GetUser>(
    async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setStatus("loggedIn");
          return parsedUser;
        }

        const { data }: { data: ApiResponse<User> } = await axios.get(
          `/api/frontend/auth/profile`
        );

        if (data.success) {
          const user = data.result; // User | undefined
          setUser(user || null); // Convert undefined to null
          setStatus("loggedIn");
          localStorage.setItem("authStatus", "loggedIn");
          localStorage.setItem("user", JSON.stringify(user || null)); // Store null if user is undefined
          return user || null; // Return null if user is undefined
        } else {
          setStatus("loggedOut");
          return null;
        }
      } catch (error) {
        setStatus("loggedOut");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProfile = useCallback<UpdateProfile>(
    async (args) => {
      try {
        const formData = new FormData();
        if (args.name) formData.append("name", args.name);
        if (args.email) formData.append("email", args.email);
        if (args.avatar && args.avatar instanceof File)
          formData.append("avatar", args.avatar);

        const response = await axios.post(
          `/api/frontend/auth/edit-profile`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data.success) {
          const updatedUser = await getUser();
          return !!updatedUser;
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        throw error;
      }
    },
    [getUser]
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

  useEffect(() => {
    getUser();
  }, [getUser]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const { data } = await axios.post(`/api/frontend/auth/refresh-token`);
      if (data.success && data.result?.access_token) {
        const newToken = data.result.access_token;
        set_cookie("token", newToken, { expires: 30 });
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
          setUser(null);
          setStatus("loggedOut");
          localStorage.removeItem("authStatus");
          localStorage.removeItem("user");
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshToken, setUser, setStatus]);

  const contextValue = useMemo(
    () => ({
      status,
      user,
      loading,
      setUser,
      setStatus,
      login,
      register,
      logout,
      getUser,
      sendOtp,
      verifyOtp,
      updateProfile,
      resetPassword,
    }),
    [
      status,
      user,
      loading,
      login,
      register,
      logout,
      getUser,
      sendOtp,
      verifyOtp,
      updateProfile,
      resetPassword,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useAuthContext: UseAuthContext = () => useContext(Context);