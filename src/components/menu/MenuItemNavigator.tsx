"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "../../context/auth-context/AuthContext";
import { logout } from "@server/actions/auth-action";
import { User } from "lucide-react";

type MenuItemNavigatorProps = {
  isMobile: boolean;
  isMenuOpen: boolean;
};

const MenuItemNavigator: React.FC<MenuItemNavigatorProps> = ({
  isMobile,
  isMenuOpen,
}) => {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { status, setStatus } = useAuthContext();

  const menuItems = [
    {
      name: "FOUND PETS",
      key: "found-pets",
      subItem: [
        { name: "FOUND DOGS", href: "/report-found-pet-form" },
        { name: "FOUND CATS", href: "/report-found-pet-form" },
        { name: "FOUND PETS [ALL]", href: "/report-found-pet-form" },
      ],
      restricted: true,
    },
    {
      name: "LOST PETS",
      key: "lost-pets",
      subItem: [
        { name: "LOST DOGS", href: "/report-lost-pet-form" },
        { name: "LOST CATS", href: "/report-lost-pet-form" },
        { name: "LOST PETS [ALL]", href: "/report-lost-pet-form" },
      ],
      restricted: true,
    },
  ];
  

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setActiveDropdown(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setStatus("loggedOut");
      localStorage.clear();
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout Error:", error);
    }
  };

  const handleNavigation = (href: string, restricted: boolean = false) => {
    if (restricted && status !== "loggedIn") {
      toast.error("Please log in to access this feature.");
      router.push("/login");
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const storedStatus = localStorage.getItem("authStatus");
    console.log("Stored auth status on navigation mount:", storedStatus);
    if (storedStatus === "loggedIn") {
      setStatus("loggedIn");
    }
  }, [setStatus]);

  return (
    <div
      className={`${isMenuOpen ? "block" : "hidden"} md:block`}
      ref={dropdownRef}
    >
      <ul className={`flex flex-col md:flex-row ${isMobile}`}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`relative ${isMobile ? "w-full" : "md:px-1 xl:px-0"}`}
          >
            <div
              className="flex items-center justify-between py-2 px-3 text-black font-semibold rounded cursor-pointer"
              onClick={() =>
                item.subItem
                  ? toggleDropdown(item.key)
                  : item.key
                  ? handleNavigation(item.key, item.restricted)
                  : null
              }
            >
              <span className="md:text-[14px] xl:text-[14px]">{item.name}</span>
              {item.subItem && (
                <svg
                  className={`w-2.5 h-2.5 text-black ms-2 transform transition-transform ${
                    activeDropdown === item.key ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              )}
            </div>

            {item.subItem && (
              <div
                className={`
                  z-[calc(var(--index)+1)]
                  ${
                    isMobile
                      ? "relative w-full bg-white border border-gray-200 rounded"
                      : "absolute left-0 bg-white shadow-md rounded-md"
                  }
                  ${activeDropdown === item.key ? "block" : "hidden"}
                  mt-1 overflow-hidden transition-all duration-200 min-w-[200px]
                `}
              >
                <ul className="py-1">
                  {item.subItem.map((subItem) => (
                    <li
                      key={subItem.name}
                      className="cursor-pointer"
                      onClick={() => handleNavigation(subItem.href, item.restricted)}
                    >
                      <span
                        className={`block px-4 py-1 text-black font-semibold ${
                          isMobile
                            ? "text-[14px]"
                            : "md:text-[14px] xl:text-[14px]"
                        }`}
                      >
                        {subItem.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}

        {status === "loggedIn" ? (
          <li className="mt-4 md:mt-0 flex items-center gap-4">
            <button
              onClick={() => handleNavigation("/dashboard/profile", true)}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <User className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full md:w-auto text-white bg-[#4eb7f0] px-4 py-2 rounded-full font-bold hover:bg-[#3a9cd3]"
            >
              LOGOUT
            </button>
          </li>
        ) : (
          <li className="mt-4 md:mt-0">
            <button
              onClick={() => router.push("/login")}
              className="w-full md:w-auto text-white bg-[#4eb7f0] px-4 py-2 rounded-full font-bold hover:bg-[#3a9cd3]"
            >
              LOGIN
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MenuItemNavigator;