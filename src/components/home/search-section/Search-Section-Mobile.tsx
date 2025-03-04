import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchComponentProps {
  isMobile: boolean;
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

export default function SearchSectionMobile({
  isMobile,
  isSearchOpen,
  toggleSearch,
}: SearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on search input when search panel opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      toggleSearch();
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      toggleSearch();
    }
  };

  // Mobile Search UI
  if (isMobile) {
    return isSearchOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex flex-col animate-fadeIn">
        <div className="bg-white p-4 shadow-lg rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative w-full rounded-full border-2 border-blue-500 focus-within:border-blue-600 transition-all duration-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="What are you looking for?"
                className="w-full py-3 px-5 focus:outline-none text-black rounded-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>
        <div className="flex-grow bg-white p-4">
          <div className="text-gray-500 text-sm mb-2">Popular Searches</div>
          <div className="space-y-2">
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center">
              <Search className="w-4 h-4 mr-2 text-gray-400" />
              Lost pets
            </div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center">
              <Search className="w-4 h-4 mr-2 text-gray-400" />
              Adoption process
            </div>
            <div className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center">
              <Search className="w-4 h-4 mr-2 text-gray-400" />
              Pet care tips
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="relative z-20">
        <button
          onClick={toggleSearch}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 mr-2"
          aria-label="Toggle search"
        >
          <Search className="w-6 h-6 text-black" />
        </button>
      </div>
    );
  }

  // Desktop Search UI
  return (
    <div className="relative mr-4">
      <div className="flex items-center rounded-full border-2 border-gray-300 focus-within:border-blue-500 overflow-hidden transition-all duration-200 hover:border-gray-400">
        <input
          type="text"
          placeholder="Search..."
          className="py-2 px-4 w-48 focus:w-64 transition-all duration-300 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button
          className="bg-blue-600 text-white p-2 flex items-center justify-center"
          onClick={handleSearch}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
