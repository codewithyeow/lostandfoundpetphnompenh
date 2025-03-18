"use client";

import User from "@models/User";
import { remove_cookie, set_cookie } from "@utils/cookie";
import { toast } from "react-toastify";
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
import exp from "constants";

const Context = createContext({} as AuthContext);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>();
  const [status, setStatus] = useState<AuthStatus>("loggedOut");


  // const sendOtp = useCallback<RequestChangePassword>(
  //   async (args) => {
  //     try {
  //       setLoading(true);
  //       if (!args.email) {
  //         throw new Error("Email is required to send OTP.");
  //       }

  //       // Call to the backend to send OTP
  //       const {
  //         data,
  //       }: {
  //         data: ApiResponse<{
  //           verify_token: string;
  //           expires_in: number;
  //           email: string;
  //         }>;
  //       } = await axios.post(
  //         `/api/frontend/auth/send-otp?email=${encodeURIComponent(args.email)}`
  //       );

  //       if (data.success && data.result) {
  //         const { verify_token, expires_in, email } = data.result;

  //         // ✅ Save token for verification in future steps
  //         localStorage.setItem("verify_token", verify_token);

  //         // Return the success response matching ApiResponse<T>
  //         return {
  //           success: true,
  //           status: 200, // HTTP status code for success
  //           title: "OK", // Title of the response
  //           code: 200, // Custom code for this action, if required
  //           message: data.message || "OTP sent successfully.",
  //           result: { verify_token, expires_in, email }, // Added email to result
  //         };
  //       } else {
  //         throw new Error(data.message || "Failed to send OTP. Try again.");
  //       }
  //     } catch (error: any) {
  //       console.error("Send OTP Error:", error);
  //       return {
  //         success: false, // False in case of error
  //         status: error.response?.status || 400, // HTTP status code for error
  //         title: "Error", // Title for the error
  //         code: error.response?.status || 400, // Custom code or HTTP status code
  //         message:
  //           error.response?.data?.message ||
  //           "Failed to send OTP. Please try again.",
  //         result: null, // No result in case of error
  //         errors: error.response?.data?.errors || {}, // Validation errors or additional error info
  //       };
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [setLoading]
  // );
  // const verifyOtp = useCallback<VerifyResetPassword>(async (args) => {
  //   try {
  //     setLoading(true);

  //     if (!args.otp_code || !args.verify_token || !args.email || !args.expires_in) {
  //       throw new Error("OTP code, verify token, and email are required.");
  //     }

  //     // Call verifyOTP with the object structure
  //     const response = await verifyOtp({
  //       otp: args.otp_code,
  //       verify_token: args.verify_token,
  //       email: args.email,
  //       expires_in: args.expires_in,
  //     });

  //     console.log("Verify OTP response:", response);

  //     if (response.success === false) {
  //       toast.error(response.message || "Failed to verify OTP.");
  //       return {
  //         success: false,
  //         status: response.status || 400,
  //         title: "Error",
  //         code: response.status || 400,
  //         message: response.message || "Failed to verify OTP.",
  //         result: null,
  //       };
  //     }

  //     // Store the reset token for the next step
  //     if (response.result?.reset_token) {
  //       localStorage.setItem("reset_token", response.result.reset_token);
  //     }

  //     toast.success(response.message || "OTP verified successfully.");
  //     return {
  //       success: true,
  //       status: response.status || 200,
  //       title: "Success",
  //       code: response.status || 200,
  //       message: response.message || "OTP verified successfully.",
  //       result: response.result,
  //     };
  //   } catch (error) {
  //     console.error("Error verifying OTP:", error);
  //     return {
  //       success: false,
  //       status: 500,
  //       title: "Error",
  //       code: 500,
  //       message: "An unexpected error occurred while verifying OTP.",
  //       result: null,
  //     };
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // Update the resetPassword function to use the reset token
  // const resetPassword = useCallback<ResetPassword>(async (args) => {
  //   try {
  //     const { newPassword, confirmPassword } = args;

  //     // Get the reset token from localStorage
  //     const reset_token = localStorage.getItem("reset_token");

  //     if (!reset_token) {
  //       toast.error("Reset token not found. Please verify your OTP first.");
  //       return {
  //         success: false,
  //         title: "Error",
  //         status: 400,
  //         code: 400,
  //         message: "Reset token not found. Please verify your OTP first.",
  //         result: null,
  //       };
  //     }

  //     // Call the resetPassword function with the reset token
  //     const result = await resetPassword(
  //       newPassword,
  //       confirmPassword,
  //       reset_token
  //     );

  //     if (result.success) {
  //       // Clear the reset token from localStorage
  //       localStorage.removeItem("reset_token");

  //       toast.success(result.message || "Password reset successfully!");
  //       return {
  //         success: true,
  //         title: "Success",
  //         status: 200,
  //         code: 200,
  //         message: result.message || "Password reset successfully.",
  //         result: null,
  //       };
  //     } else {
  //       toast.error(result.message || "Failed to reset password.");
  //       return {
  //         success: false,
  //         title: "Error",
  //         status: result.status || 400,
  //         code: result.status || 400,
  //         message: result.message || "Failed to reset password.",
  //         result: null,
  //       };
  //     }
  //   } catch (error) {
  //     toast.error("Error resetting password.");
  //     return {
  //       success: false,
  //       title: "Error",
  //       status: 500,
  //       code: 500,
  //       message: "An unexpected error occurred while resetting password.",
  //       result: null,
  //     };
  //   }
  // }, []);

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