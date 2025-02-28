"use client";
import React, { useState, Fragment } from "react";
import { useRouter } from "next/navigation"; 
import { useTranslations } from "next-intl";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

const Login: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("login");

  // Static credentials
  const staticEmail = "admin@gmail.com";
  const staticPassword = "123456";

  // State to hold input values and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // Success modal state

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate static credentials
    if (email === staticEmail && password === staticPassword) {
      setError(""); // Clear any error message
      setIsSuccessOpen(true); // Open the success modal
      setTimeout(() => {
        setIsSuccessOpen(false); // Close the success modal after a delay
        router.push("/dashboard/mypet"); // Navigate to the dashboard
      }, 2000); // Adjust the delay if necessary
    } else {
      setError("Invalid email or password");
      setIsOpen(true); // Open the alert modal
    }
  };

  const goToSignUp = () => {
    router.push("/register");
  };

  const closeModal = () => {
    setIsOpen(false); // Close the error modal
  };

  const closeSuccessModal = () => {
    setIsSuccessOpen(false); // Close the success modal manually if needed
  };

  return (
    <div className="bg-[#EFEEF1] min-h-screen flex flex-col lg:px-8 px-4 w-full">
      <div className="sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center font-bold leading-9 tracking-tight text-customGray lg:text-2xl text-lg">
          {t('Login To Lost & Found Pet')}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm">
        <form className="space-y-6 lg:p-8 p-4 bg-white rounded-lg shadow-md" onSubmit={handleLogin}>
          {/* Email input */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password input */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Sign in button */}
          <div className="mt-6">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 lg:py-3 py-2 lg:text-lg text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in
            </button>
          </div>

          {/* Sign up link */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            <p className="text-center lg:text-base text-sm text-gray-500">
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={goToSignUp}
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500 lg:text-base text-sm"
            >
              Sign up!
            </button>
            
          </div>
        </form>
      </div>

      {/* Error Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-600"
                  >
                    {t('Login Error')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {error}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Success Modal */}
      <Transition appear show={isSuccessOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeSuccessModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-green-600"
                  >
                    {t('Login Successful')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You have successfully logged in.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={closeSuccessModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Login;
