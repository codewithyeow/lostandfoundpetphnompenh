"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";

import { FaEnvelope, FaLock } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { useAuthContext } from "../context/auth-context/AuthContext";
import { useRouter } from "next/navigation";
import { login } from "@server/actions/auth-action";
import { toast } from "react-toastify";
import { AuthStatus } from "../context/types";

const initialValues = { email: "", password: "" };

const Login: React.FC = () => {
  const router = useRouter();
  const { getUser } = useAuthContext();
  const [status, setStatus] = useState<undefined | AuthStatus>();

  const handleFormSubmit = async (values: any) => {
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      console.log("API Response:", response); // Debugging

      if (!response.success) {
        toast.error(
          response.message || "Invalid email or password. Please try again."
        );
      } else if (response.result && response.result.user) {
        toast.success("Logged in successfully!");
        setStatus("loggedIn");
        await getUser();
        router.push("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected Error:", error);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
    });

  return (
    <section className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-10 bg-[#4eb7f0] mr-3 rounded-full"></div>
          <h2 className="font-bold text-xl text-[#4eb7f0]">LOGIN</h2>
          <div className="h-1 w-10 bg-[#4eb7f0] ml-3 rounded-full"></div>
        </div>
        <Card className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-500 mt-2">
              Please login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="p-2 space-y-5">
              {/* Email Input */}
              <div>
                <div className="flex items-center mb-2">
                  <FaEnvelope className="mr-2 text-gray-500" />
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center mb-2">
                  <FaLock className="mr-2 text-gray-500" />
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
                  required
                />
                <div className="text-right mt-2">
                  <Link href="/forgotPassword">
                    <span className="text-[#4eb7f0] text-sm font-medium hover:underline">
                      Forgot Password?
                    </span>
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full border-2 text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white rounded-full border-[#4eb7f0] py-3 transition-colors duration-200"
              >
                Login
              </button>
            </form>

            {/* Link to Signup Page */}
            <p className="text-sm text-center text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-[#4eb7f0] font-medium hover:underline">
                  Sign up
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default Login;
