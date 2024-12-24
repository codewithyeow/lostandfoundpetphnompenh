"use client";
import React, { useState } from "react";
import Button from "../buttons/Button";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

type HeaderProps = {
  locale?: string;
};
const Header: React.FC<HeaderProps> = ({ locale = 'en' }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search input
  const t = useTranslations("header");

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    router.push("/login");
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev); // Toggle the search input
  };

  // Hide the menu when search is open
  const menuVisibilityClass = isSearchOpen ? 'hidden' : 'block';

  return (
    <nav className="bg-[#8DC63F] w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://www.pawboost.com/images/global/pawboost-logo-mobile.png"
            className="h-9 w-auto"
            alt="PawBoost Logo"
          />
        </a>

        {/* Right side container */}
        <div className="flex items-center md:order-2 space-x-4">
          {/* Language Switcher - visible on all screens */}
          <LanguageSwitcher menuDirection="right" locale={locale} />

          {/* Login Button - visible only on desktop */}
          <div className="hidden md:block">
            <Button
              variant="contained"
              size="medium"
              color="primary"
              width="60px"
              height="30px"
              style={{ backgroundColor: "blue", fontSize: "12px" }}
              onClick={handleLoginClick}
            >
              {t('Login')}
            </Button>
          </div>

          {/* Hamburger Menu Button - visible only on mobile */}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 h-10 justify-center text-sm text-white rounded-lg md:hidden focus:outline-none ml-2"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              // Close "X" icon when the menu is open
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon when the menu is closed
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu and Desktop Navigation */}
        <div
          className={`${menuVisibilityClass} ${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 bg-[#8DC63F]">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent"
              >
                Contact
              </a>
            </li>
            {/* Login Button in Mobile Menu */}
            <li className="md:hidden mt-2">
              <Button
                variant="contained"
                size="medium"
                color="primary"
                width="100%"
                height="40px"
                style={{ backgroundColor: "blue", fontSize: "12px" }}
                onClick={handleLoginClick}
              >
                Login
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
