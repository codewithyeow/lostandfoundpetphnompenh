"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import MenuItemNavigator from "../../components/menu/MenuItemNavigator";
import Container from "../ui/container";
import { useMaxWidth } from "../../utils/useMaxWidth";
import LanguageSwitcher from "@component/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import SearchComponentMobile from "../home/search-section/Search-Section-Mobile";

type HeaderProps = {
  locale?: string;
};

const Header: React.FC<HeaderProps> = ({ locale = "en" }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const maxWidth = useMaxWidth("sm");

  // Close the search box when the screen size changes to a larger screen
  useEffect(() => {
    if (maxWidth && maxWidth > 640) {
      setIsSearchOpen(false);
    }
  }, [maxWidth]);

  // Close the hamburger menu and submenu when the route changes
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleSearch = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoLoad = () => {
    setIsLogoLoading(false);
  };

  const menuVisibilityClass = isMenuOpen ? "block" : "hidden";

  return (
    <nav className="bg-[#FFFFFF] w-full z-20 top-0 start-0 sticky border-b-4 border-[#4eb7f0]">
      <Container>
        <div className="max-w-[1150px] flex items-center justify-between mx-auto px-4 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <Avatar style={{ width: "60px", height: "60px" }}>
              {isLogoLoading && (
                <Skeleton className="w-[60px] h-[60px] rounded-full" />
              )}
              <AvatarImage
                src="/assets/logo.png"
                alt="Logo"
                onLoad={handleLogoLoad}
                className={isLogoLoading ? "hidden" : "block"}
              />
            </Avatar>
          </a>

          <div className="flex-grow"></div>

          {/* Conditionally Render Search Icon and Language Switcher on Mobile */}
          {maxWidth && maxWidth <= 640 && (
            <>
              <SearchComponentMobile 
                isMobile={true} 
                isSearchOpen={isSearchOpen} 
                toggleSearch={toggleSearch} 
              />
              <LanguageSwitcher menuDirection="left" locale={locale} />
            </>
          )}

          {/* On Larger Screens, Show Language Switcher next to Search */}
          {maxWidth && maxWidth > 640 && (
            <div className="flex items-center order-2 bg-[#FFFFFF]">
              <LanguageSwitcher menuDirection="right" locale={locale} />
            </div>
          )}

          <div className="flex items-center order-2 bg-[#FFFFFF]">
            {/* Hamburger Button */}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center h-10 justify-center text-sm text-black rounded-lg focus:outline-none ml-2 lg:hidden"
              aria-controls="navbar-sticky"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
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
              left-0 right-0 top-full bg-[#FFFFFF]
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
                style={{ gap: "0.5rem", padding: "0.5rem", }}
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