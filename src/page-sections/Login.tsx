"use client";
import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Add the necessary icons
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Perform login logic here...
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

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
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 border-2 border-[#4eb7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4eb7f0] transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full border-2 text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white rounded-full border-[#4eb7f0] py-3 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Link to Signup Page */}
            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-[#4eb7f0] font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
