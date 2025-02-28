"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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

  const menuItems = [
    {
      name: "MY PET",
      key: "my-pet",
      href: "/dashboard/mypet", 
    },
    {
      name: "FOUND PETS",
      key: "found-pets",
      subItem: [
        { name: "FOUND DOGS", href: "/report-found-pet-form" },
        { name: "FOUND CATS", href: "/report-found-pet-form" },
        { name: "FOUND PETS [ALL]", href: "/report-found-pet-form" },
      ],
    },
    {
      name: "LOST PETS",
      key: "lost-pets",
      subItem: [
        { name: "LOST DOGS", href: "/report-lost-pet-form" },
        { name: "LOST CATS", href: "/report-lost-pet-form" },
        { name: "LOST PETS [ALL]", href: "/report-lost-pet-form" },
      ],
    },
    {
      name: "HAPPY TALES",
      key: "happy-tales",
      href: "/success-stories",
    },
    {
      name: "ABOUT US",
      key: "about-us",
      href: "/about",
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

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
                  : item.href && router.push(item.href)
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
                      className=" cursor-pointer"
                      onClick={() => subItem.href && router.push(subItem.href)}
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

        <li className="mt-4 md:mt-0">
          <a href="/login">
            <button className="w-full md:w-auto text-white bg-[#4eb7f0] px-4 py-2 text-16px rounded-full transition-colors duration-200 font-bold ">
              LOGIN
            </button>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MenuItemNavigator;
