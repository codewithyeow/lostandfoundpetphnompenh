// Header.tsx
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

  useEffect(() => {
    if (maxWidth && maxWidth > 640) {
      setIsSearchOpen(false);
    }
  }, [maxWidth]);

  const pathname = usePathname();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleSearch = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    if (isSearchOpen) setIsSearchOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoLoad = () => setIsLogoLoading(false);

  return (
    <nav className="bg-white w-full z-50 top-0 sticky border-b-4 border-[#4eb7f0] shadow-sm">
      <Container>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3 md:py-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <a href="/" className="flex items-center">
              <Avatar className="w-12 h-12 md:w-16 md:h-16 transition-all duration-300">
                {isLogoLoading && <Skeleton className="w-full h-full rounded-full" />}
                <AvatarImage
                  src="/assets/logo.png"
                  alt="Logo"
                  onLoad={handleLogoLoad}
                  className={isLogoLoading ? "hidden" : "block"}
                />
              </Avatar>
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:order-2 md:space-x-4 rtl:space-x-reverse items-center">
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

            {maxWidth && maxWidth > 640 && (
              <LanguageSwitcher menuDirection="right" locale={locale} />
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
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
            </button>
          </div>

          {/* Navigation Menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:flex md:w-auto md:order-1 transition-all duration-300`}
            id="navbar-default"
          >
            <MenuItemNavigator
              isMobile={maxWidth ? maxWidth <= 640 : false}
              isMenuOpen={isMenuOpen}
            />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Header;