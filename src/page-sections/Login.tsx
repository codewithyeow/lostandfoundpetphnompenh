"use client";
import React from "react";
import { useRouter } from "next/navigation"; 
import { useTranslations } from "next-intl";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("login");

  const goToSignUp = () => {
    router.push("/register");
  };

  return (
    <div className="bg-[#E4EAEE] min-h-screen flex flex-col lg:px-8 px-4 w-full">
      <div className="sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center font-bold leading-9 tracking-tight text-customGray lg:text-2xl text-lg">
          {t('Login To Lost & Found Pet')}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm">
        <form className="space-y-6 lg:p-8 p-4 bg-white rounded-lg shadow-md" action="#" method="POST">
          <div>
            <div className="flex items-center mb-4">
              <FaEnvelope className="mr-2 text-gray-500 lg:text-xl" />
              <label
                htmlFor="email"
                className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray"
              >
                Email
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaLock className="mr-2 text-gray-500 lg:text-xl" />
                <label
                  htmlFor="password"
                  className="block lg:text-lg text-sm font-medium leading-6 text-customGray"
                >
                  Password
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:text-blue-500 lg:text-base"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 lg:py-3 py-2 lg:text-lg text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2">
            <p className="text-center lg:text-base text-sm text-gray-500">
              Don't have an account?
            </p>
            <button
              onClick={goToSignUp} 
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500 lg:text-base text-sm"
            >
              Sign up!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;