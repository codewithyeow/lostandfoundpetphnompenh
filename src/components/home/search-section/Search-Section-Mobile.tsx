import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { search } from "@server/actions/animal-action";

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
  const [breed, setBreed] = useState("");
  const [species, setSpecies] = useState("");
  const [size, setSize] = useState("");
    const [results, setResults] = useState<any[] | null>(null); 

  const handleSearch = async () => {
    console.log("Searching with:", { breed, species, size });

    const params = {
      species: species ? parseInt(species, 10) : undefined,
      breed_id: breed ? parseInt(breed, 10) : undefined,
      size: size ? parseInt(size, 10) : undefined,
    };

    const data = await search(params);
    if (data) {
      setResults(data);
    }
  };

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
          <div className="flex flex-col gap-3 mb-4">
            {/* Breed Filter */}
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full h-10 px-4 text-black bg-white border-2 border-gray-200 rounded-full"
            >
              <option value="">Select Breed</option>
              <option value="labrador">Labrador</option>
              <option value="bulldog">Bulldog</option>
              <option value="beagle">Beagle</option>
            </select>

            {/* Species Filter */}
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full h-10 px-4 text-black bg-white border-2 border-gray-200 rounded-full"
            >
              <option value="">Select Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
            </select>

            {/* Size Filter */}
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full h-10 px-4 text-black bg-white border-2 border-gray-200 rounded-full"
            >
              <option value="">Select Size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={!breed && !species && !size}
            className="w-full px-8 h-12 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5 mr-2 inline" /> Search
          </button>
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
  return null;
}
