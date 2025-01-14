"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { set_cookie } from "../utils/cookie";
import { useRouter } from "next/navigation";

type LanguageOption = {
  title: string;
  imgUrl: string;
  code: string;
};

const languages: LanguageOption[] = [
  { title: "EN", code: "en", imgUrl: "/assets/flags/usa.png" },
  { title: "KH", code: "km", imgUrl: "/assets/flags/kh.png" },
];

type Props = {
  locale?: string;
  menuDirection?: "left" | "right";
  onCloseModal?: () => void;
};

const LanguageSwitcher: React.FC<Props> = ({
  locale = "en",
  menuDirection = "right",
  onCloseModal,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageOption>(
    languages.find((lang) => lang.code === locale) || languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLanguageClick = (language: LanguageOption) => {
    set_cookie("locale", language.code);
    setLanguage(language);
    setIsOpen(false);
    router.refresh();
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Current Language Display */}
      <div
        className="flex items-center h-10 cursor-pointer  py-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          width={24}
          height={14}
          loading="lazy"
          src={language.imgUrl}
          alt={language.title}
          className="object-contain"
        />
        {/* Adjusting the text size using text-sm */}
        <span className="ml-2 font-semibold text-black text-xs">
          {language.title}
        </span>
        <span
          className={`ml-2 text-xs transition-transform duration-200 text-black ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>
      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1 bg-white shadow-lg rounded-md overflow-hidden z-50 min-w-[120px] ${
            menuDirection === "right" ? "left-0" : "right-0"
          }`}
        >
          {languages.map((item) => (
            <div
              key={item.title}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                language.code === item.code ? "bg-gray-50" : ""
              }`}
              onClick={() => handleLanguageClick(item)}
            >
              <Image
                width={24}
                height={14}
                loading="lazy"
                src={item.imgUrl}
                alt={item.title}
                className="object-contain"
              />
              <span className="ml-2 font-semibold text-black text-xs">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
