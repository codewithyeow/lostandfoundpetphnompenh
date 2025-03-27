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

  const sendOtp = useCallback<RequestChangePassword>(
    async (args) => {
      try {
        setLoading(true);
        if (!args.email) {
          throw new Error("Email is required to send OTP.");
        }

        // Call to the backend to send OTP
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

          // ✅ Save token for verification in future steps
          localStorage.setItem("verify_token", verify_token);

          // Return the success response matching ApiResponse<T>
          return {
            success: true,
            status: 200, // HTTP status code for success
            title: "OK", // Title of the response
            code: 200, // Custom code for this action, if required
            message: data.message || "OTP sent successfully.",
            result: { verify_token, expires_in, email }, // Added email to result
          };
        } else {
          throw new Error(data.message || "Failed to send OTP. Try again.");
        }
      } catch (error: any) {
        console.error("Send OTP Error:", error);
        return {
          success: false, // False in case of error
          status: error.response?.status || 400, // HTTP status code for error
          title: "Error", // Title for the error
          code: error.response?.status || 400, // Custom code or HTTP status code
          message:
            error.response?.data?.message ||
            "Failed to send OTP. Please try again.",
          result: null, // No result in case of error
          errors: error.response?.data?.errors || {}, // Validation errors or additional error info
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const verifyOtp = useCallback<VerifyResetPassword>(async (args) => {
    try {
      setLoading(true);
      const verify_token = localStorage.getItem("verify_token");

      if (!args.otp_code || !verify_token || !args.email) {
        throw new Error("OTP code and email are required.");
      }
      // 2. Fix function name to use verifyOTP (from auth-actions) instead of verifyOtp
      const response = await verifyOtpAction({
        otp: args.otp_code,
        verify_token: verify_token,
        email: args.email,
      });

      console.log("Verify OTP response:", response);

      // 3. Remove expires_in from the request as it's not needed for verification
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

      // 4. Cleanup verify_token after successful verification
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
  }, []);

  // Update the resetPassword function to use the reset token
  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const { newPassword, confirmPassword } = args;

      // Get the reset token from localStorage
      const reset_token = localStorage.getItem("reset_token");

      if (!reset_token) {
        toast.error("Reset token not found. Please verify your OTP first.");
        return {
          success: false,
          title: "Error",
          status: 400,
          code: 400,
          message: "Reset token not found. Please verify your OTP first.",
          result: null,
        };
      }

      // Call the resetPassword function with the reset token
      const result = await resetPassword(
        newPassword,
        confirmPassword,
        reset_token
      );

      if (result.success) {
        // // Clear the reset token from localStorage
        // localStorage.removeItem("reset_token");

        toast.success(result.message || "Password reset successfully!");
        return {
          success: true,
          title: "Success",
          status: 200,
          code: 200,
          message: result.message || "Password reset successfully.",
          result: null,
        };
      } else {
        toast.error(result.message || "Failed to reset password.");
        return {
          success: false,
          title: "Error",
          status: result.status || 400,
          code: result.status || 400,
          message: result.message || "Failed to reset password.",
          result: null,
        };
      }
    } catch (error) {
      toast.error("Error resetting password.");
      return {
        success: false,
        title: "Error",
        status: 500,
        code: 500,
        message: "An unexpected error occurred while resetting password.",
        result: null,
      };
    }
  }, []);

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
          name: args.name,
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
      // The axios interceptor will handle token refresh if needed
      const { data }: { data: ApiResponse<User> } = await axios.get(
        `/api/frontend/auth/profile`
      );

      if (data.success) {
        const user = data.result;

        setUser(user);
        setStatus("loggedIn");

        localStorage.setItem("authStatus", "loggedIn");
        localStorage.setItem("user", JSON.stringify(user));

        return user;
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
  }, []);

  const updateProfile = useCallback<UpdateProfile>(
    async (args) => {
      try {
        // Create a FormData object to properly handle file uploads
        const formData = new FormData();
        if (args.name) {
          formData.append("name", args.name);
        }
        if (args.email) {
          formData.append("email", args.email);
        } else {
          throw new Error("Email is required.");
        }

        // Only append avatar if it exists and is a valid File
        if (args.avatar && args.avatar instanceof File) {
          formData.append("avatar", args.avatar);
        }

        // Send with proper content-type header for FormData
        const response = await axios.post(
          `/api/frontend/auth/edit-profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Check if the update was successful
        if (response.data && response.data.success) {
          const updatedUser = await getUser();

          if (updatedUser) {
            return true;
          } else {
            throw new Error("Failed to refresh user profile");
          }
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (error) {
        throw error;
      }
    },
    [getUser]
  );

  useEffect(() => {
    getUser();
  }, [getUser]);

  // Add this to your existing AuthContext

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const { data } = await axios.post(`/api/frontend/auth/refresh-token`);

      if (data.success && data.result?.access_token) {
        const newToken = data.result.access_token;

        // Update token in cookies
        set_cookie("token", newToken, { expires: 30 });

        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }, []);

  // Create an axios interceptor to handle 401 errors and refresh token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshToken();

            if (newToken) {
              // Update the Authorization header
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              // Retry the original request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }

          // If refresh failed, clear auth state and redirect to login
          setUser(null);
          setStatus("loggedOut");
          localStorage.removeItem("authStatus");
          localStorage.removeItem("user");

          // Navigate to login page if you have a navigation function
          // router.push('/login');
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshToken, setUser, setStatus]);

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

  return (
    <Context.Provider
      value={{
        status,
        user,
        loading,
        sendOtp,
        verifyOtp,
        updateProfile,
        resetPassword,
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
