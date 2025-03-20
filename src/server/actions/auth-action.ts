// server/actions/animal-action.ts
"use server";
import axios from "@lib/axios";
import { getAuthHeaders } from "@server/helper";
import { revalidatePath } from "next/cache";
import User from "@models/User";
import { cookies } from "next/headers";
import { ApiResponse } from "interfaces";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const cookieOption: Partial<ResponseCookie> = { maxAge: 30 * 24 * 60 * 60 }; // 30 days

interface Response<T = undefined> {
  status: number;
  error: boolean;
  message?: string;
  data?: T;
  verify_token?: string;
  expires_in?: number;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name: string;
  avatar?: string;
}

interface RegisterArgs {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function sendOTP(email: string): Promise<Response> {
  try {
    const endpoint = `/api/frontend/auth/send-otp?email=${encodeURIComponent(
      email
    )}`;
    const { data } = await axios.post(endpoint, {}, { headers: {} });

    console.log("Send OTP Response:", data);
    const { verify_token, expires_in } = data.result || {};

    return {
      error: false,
      status: data.code || 200,
      message:
        data.message || "OTP sent successfully. Please check your email.",
      verify_token,
      expires_in,
    };
  } catch (error: any) {
    console.error("Send OTP Error:", error.response?.data);

    return {
      error: true,
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Failed to send OTP. Please try again later.",
    };
  }
}

export const verifyOTP = async (args: {
  otp: string;
  verify_token: string;
  email: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      `/api/frontend/auth/verify-otp`,
      {
        otp: args.otp,
        verify_token: args.verify_token,
        email: args.email,
      },
      {
        headers: {
          Authorization: `Bearer ${args.verify_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Verify OTP Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error in verifyOTP:", error);
    return {
      success: false,
      code: error.response?.status || 500,
      title: "OTP Verification Failed",
      message: error.response?.data?.message || "Failed to verify OTP",
      result: null,
    };
  }
};

export const resetPassword = async (
  newPassword: string,
  passwordConfirmation: string,
  reset_token: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(
      "/api/frontend/auth/reset-password",
      {
        new_password: newPassword,
        password_confirmation: passwordConfirmation,
        reset_token: reset_token,
      },
      {
        headers: {
          Authorization: `Bearer ${reset_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Reset Password Response:", response.data);
    return {
      success: true,
      status: response.data.code || 200,
      message: response.data.message || "Password reset successfully",
      title: "Password Reset Successful",
      code: response.data.code || 200,
    };
  } catch (error: any) {
    console.error("❌ Error resetting password:", error);

    return {
      success: false,
      code: error.response?.status || 500,
      title: "OTP Verification Failed",
      message: error.response?.data?.message || "Failed to verify OTP",
      result: null,
    };
  }
};

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
      resCookies.set("token", token, cookieOption);
      revalidatePath("/(auth)", "layout");
    }

    return data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data);

    return {
      success: false,
      title: "Login Failed",
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Invalid credentials. Please try again.",
      errors: error.response?.data?.errors || {},
    };
  }
}

export async function register(args: RegisterArgs): Promise<ApiResponse<User>> {
  try {
    const registerEndpoint = `/api/frontend/auth/register`;

    const { data }: { data: ApiResponse<User> } = await axios.post(
      registerEndpoint,
      {
        name: args.name,
        email: args.email,
        password: args.password,
        password_confirmation: args.password_confirmation,
      },
      { headers: getAuthHeaders() }
    );

    const token = data.result?.access_token;

    if (token) {
      const resCookies = cookies();
      resCookies.set("token", token, cookieOption);
      revalidatePath("/(auth)", "layout");
    }

    return data;
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("Registration Error:", errorData);

    // Handle case where the email is already taken
    if (errorData?.code === 400 && errorData?.errors?.email) {
      return {
        success: false,
        title: "Registration Failed",
        code: 400,
        message: errorData?.message || "The email has already been taken.",
        errors: errorData?.errors || {},
      };
    }
    return {
      success: false,
      title: "Registration Failed",
      code: error.response?.status || 500,
      message: errorData?.message || "Registration failed. Please try again.",
      errors: errorData?.errors || {},
    };
  }
}

export async function logout(): Promise<void> {
  try {
    await axios.post(
      `/api/frontend/auth/logout`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  } catch {
  } finally {
    const resCookies = cookies();
    resCookies.delete("token");
    revalidatePath("/(auth)", "layout");
  }
}

export async function getUserProfile(): Promise<Response<User>> {
  try {
    const { data }: { data: ApiResponse<User> } = await axios.get(
      `/api/v1/auth/profile?meta=1`,
      {
        headers: getAuthHeaders(),
      }
    );

    return {
      error: false,
      status: data.code || 200,
      data: data.result,
    };
  } catch (error: any) {
    return {
      error: true,
      status: error.response?.status || 500,
      message:
        error.response?.status === 401
          ? "Unauthorized"
          : error.response?.data?.message || "An unexpected error occurred",
    };
  }
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<Omit<Response<any>, "data">> {
  try {
    await axios.post(`/api/v1/auth/update`, data, {
      headers: getAuthHeaders(),
    });
    revalidatePath("/profile");
    return {
      error: false,
      status: 200,
    };
  } catch (error: any) {
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An unexpected error occurred",
    };
  }
}
