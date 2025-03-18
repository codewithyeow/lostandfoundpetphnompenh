"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope,FaUser, FaLock, FaCheckCircle } from "react-icons/fa";
import { register } from "@server/actions/auth-action";
import { useAuthContext } from "../context/auth-context/AuthContext";
import { toast } from "react-toastify";
import { useFormik } from "formik";

const Signup: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { getUser, setStatus: setAuthStatus } = useAuthContext();

  const handleSignup = async (values: any) => {
    try {
      const response = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      if (response.success) {
        await getUser();
        toast.success("Signup successful!");
        // setAuthStatus("loggedIn");
        setTimeout(() => {
          router.push("/login");
        }, 300);
      } else {
        setError(response.message || "Failed to create account");
      }
    } catch (error) {
      setError("Something went wrong, please try again");
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "", password_confirmation: "" },
    onSubmit: handleSignup,
  });

  return (
    <section className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-10 bg-[#4eb7f0] mr-3 rounded-full"></div>
          <h2 className="font-bold text-xl text-[#4eb7f0]">SIGN UP</h2>
          <div className="h-1 w-10 bg-[#4eb7f0] ml-3 rounded-full"></div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden p-6">
          <h3 className="text-2xl font-bold text-center mb-4">
            Create Account
          </h3>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
          <div>
              <div className="flex items-center mb-2">
                <FaUser className="mr-2 text-gray-500" />
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
              />
            </div>
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
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
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
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="flex items-center mb-2">
                <FaCheckCircle className="mr-2 text-gray-500" />
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
              </div>
              <input
                id="confirm-password"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm your password"
                value={formik.values.password_confirmation}
                onChange={formik.handleChange}
                className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full border-2 text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white rounded-full border-[#4eb7f0] py-3 transition-colors duration-200"
            >
              Sign up!
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-[#4eb7f0] font-medium hover:underline"
            >
              Sign in!
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
