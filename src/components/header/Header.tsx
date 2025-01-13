"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import MenuItemNavigator from "../../components/menu/MenuItemNavigator";
import Container from "../../components/ui/container";
import { useMaxWidth } from "../../utils/useMaxWidth";

type HeaderProps = {
  locale?: string;
};

const Header: React.FC<HeaderProps> = ({ locale = "en" }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search panel
  const maxWidth = useMaxWidth("sm");

  // Close the search box when the screen size changes to a larger screen
  useEffect(() => {
    if (maxWidth && maxWidth > 640) {
      setIsSearchOpen(false); // Automatically close search when on larger screens
    }
  }, [maxWidth]);

  const menuVisibilityClass = isMenuOpen ? "block" : "hidden";

  return (
    <nav className="bg-[#F8F9FA] w-full z-20 top-0 start-0 sticky">
      <Container>
        <div className="max-w-[1150px] flex items-center justify-between mx-auto px-4 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img
              src="https://www.pawboost.com/images/global/pawboost-logo-mobile.png"
              className="h-9 w-auto"
              alt="PawBoost Logo"
            />
          </a>

          <div className="flex-grow"></div>

          {/* Conditionally Render Search Icon on Mobile */}
          {maxWidth && maxWidth <= 640 && (
            <>
              <Search
                className="w-6 h-6 text-gray-400 mr-4 cursor-pointer"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              {isSearchOpen && (
                <div
                  className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 z-30"
                  style={{ maxWidth: "640px" }}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex items-center order-2 bg-[#F8F9FA]">
            {/* Hamburger Button */}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 h-10 justify-center text-sm text-black rounded-lg focus:outline-none ml-2 lg:hidden"
              aria-controls="navbar-sticky"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
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

          {/* Navigation Menu */}
          <div
            className={`
              ${menuVisibilityClass}
              absolute left-0 right-0 top-full bg-[#F8F9FA]
              transition-all duration-300 ease-in-out
              ${
                isMenuOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }
              lg:relative lg:flex lg:w-auto lg:order-1 lg:grow lg:justify-end
              lg:opacity-100 lg:max-h-full lg:overflow-visible
            `}
            id="navbar-sticky"
          >
            <div
              className={`
                ${isMenuOpen ? "py-2" : "py-0"} 
                transition-all duration-300
                lg:py-0
              `}
            >
              <ul
                className="flex flex-col lg:p-0 font-medium lg:items-center items-start lg:flex-row rtl:space-x-reverse text-md ml-2"
                style={{ gap: "0.5rem", padding: "0.5rem" }}
              >
                <MenuItemNavigator
                  isMobile={isMenuOpen}
                  isMenuOpen={isMenuOpen}
                />
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Header;
