"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { sendOTP, verifyOTP, resetPassword } from "@server/actions/auth-action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@component/ui/card";
import { Link } from "lucide-react";

// Validation schemas for each step
const validationSchemas = {
  step1: yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  }),
  step2: yup.object({
    otp: yup.string().required("OTP is required"),
  }),
  step3: yup.object({
    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  }),
};

const initialValues = { email: "", otp: "", verifyOtp: "" };
const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const initialValues = {
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (step === 1) {
        const response = await sendOTP(values.email);

        if (!response.error) {
          toast.success(response.message);
          if (response.verify_token) {
            setVerifyToken(response.verify_token);
            setUserEmail(values.email);
            localStorage.setItem("verify_token", response.verify_token);
            localStorage.setItem("user_email", values.email);
            setStep(2);
          } else {
            toast.error("Failed to get verification token.");
          }
        } else {
          toast.error(response.message);
        }
      } else if (step === 2) {
        // Use the updated verifyOTP function with the correct parameters
        if (!verifyToken) {
          // Try to retrieve from localStorage as a fallback
          const storedToken = localStorage.getItem("verify_token");
          const storedEmail = localStorage.getItem("user_email");

          if (storedToken && storedEmail) {
            setVerifyToken(storedToken);
            setUserEmail(storedEmail);
          } else {
            toast.error(
              "Verification token is missing. Please restart the process."
            );
            setStep(1);
            setLoading(false);
            return;
          }
        }

        const verifyArgs = {
          email: userEmail,
          otp: values.otp,
          verify_token:
            verifyToken || localStorage.getItem("verify_token") || "",
        };

        const response = await verifyOTP({
          otp: values.otp,
          verify_token:
            verifyToken || localStorage.getItem("verify_token") || "",
          email: userEmail || localStorage.getItem("user_email") || "",
        });
        if (response.success) {
          toast.success("OTP verified successfully!");
          // Store the reset token if it's returned
          if (response.result?.reset_token) {
            setResetToken(response.result.reset_token);
            localStorage.setItem("reset_token", response.result.reset_token);
          }
          setStep(3);
        } else {
          toast.error(response.message || "Failed to verify OTP.");
        }
      } else if (step === 3) {
        // Get the reset token from state or localStorage
        const token = resetToken || localStorage.getItem("reset_token");

        if (!token) {
          toast.error("Reset token is missing. Please restart the process.");
          setStep(1);
          setLoading(false);
          return;
        }

        const response = await resetPassword(
          values.newPassword,
          values.confirmPassword,
          token
        );

        if (response.success) {
          toast.success("Password reset successfully!");
          // Clean up stored tokens
          localStorage.removeItem("verify_token");
          localStorage.removeItem("reset_token");
          localStorage.removeItem("user_email");
          router.push("/login"); // Redirect to login after success
        } else {
          toast.error(response.message || "Failed to reset password.");
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues,
    validationSchema: validationSchemas[`step${step}`],
    onSubmit: handleFormSubmit,
  });

  return (
    <section className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-10 bg-[#4eb7f0] mr-3 rounded-full"></div>
          <h2 className="font-bold text-xl text-[#4eb7f0]">FORGOT PASSWORD</h2>
          <div className="h-1 w-10 bg-[#4eb7f0] ml-3 rounded-full"></div>
        </div>
        <Card className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-center">
              {step === 1
                ? "Reset Password"
                : step === 2
                ? "Verify OTP"
                : "Set New Password"}
            </CardTitle>
            <CardDescription className="text-center text-gray-500 mt-2">
              {step === 1 &&
                "Enter your email to receive a password reset OTP."}
              {step === 2 && "Enter the OTP sent to your email."}
              {step === 3 && "Enter your new password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="p-2 space-y-5">
              {/* Form content based on the current step */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg"
                  />
                  {touched.email && typeof errors.email === "string" && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>
              )}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={values.otp}
                    onChange={handleChange}
                    className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg"
                  />
                  {touched.otp && typeof errors.otp === "string" && (
                    <div className="text-red-500 text-sm">{errors.otp}</div>
                  )}
                </div>
              )}
              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={values.newPassword}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg"
                    />
                    {touched.newPassword &&
                      typeof errors.newPassword === "string" && (
                        <div className="text-red-500 text-sm">
                          {errors.newPassword}
                        </div>
                      )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg"
                    />
                    {touched.confirmPassword &&
                      typeof errors.confirmPassword === "string" && (
                        <div className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </div>
                      )}
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full border-2 text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white rounded-full border-[#4eb7f0] py-3"
              >
                {step === 1
                  ? "Send OTP"
                  : step === 2
                  ? "Verify OTP"
                  : "Reset Password"}
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              <Link
                href="/login"
                className="text-[#4eb7f0] font-medium hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ForgotPassword;