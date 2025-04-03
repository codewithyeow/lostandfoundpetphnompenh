"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useMaxWidth } from "../../../utils/useMaxWidth";
import { search, MyPet } from "@server/actions/animal-action";

interface PetReport {
  id: number;
  animal_id: number;
  report_id: string;
  name: string;
  description: string;
  image: string;
  badgeType: "Lost" | "Found";
  report_type: string;
  location: string;
  date: string;
  status: "Active" | "Reunited";
  reward?: string;
  breed_id: string;
  species: string;
  sex: string;
  size: string;
  distinguishing_features: string;
  date_lost?: string;
  nearest_address_last_seen?: string;
  date_found?: string;
  where_pet_was_found?: string;
  condition?: string;
  additional_details?: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
}

interface SearchSectionProps {
  onSearchResults: (results: PetReport[] | null) => void;
}

export default function SearchSection({ onSearchResults }: SearchSectionProps) {
  const [breed, setBreed] = useState("");
  const [species, setSpecies] = useState("");
  const [size, setSize] = useState("");
  const maxWidth = useMaxWidth("sm");

  if (maxWidth && maxWidth <= 640) {
    return null;
  }

  const handleSearch = async () => {
    console.log("🔍 Searching with:", { breed, species, size });
  
    const params: Record<string, number | undefined> = {
      species: species && !isNaN(Number(species)) ? parseInt(species, 10) : undefined,
      breed_id: breed && !isNaN(Number(breed)) ? parseInt(breed, 10) : undefined,
      size: size && !isNaN(Number(size)) ? parseInt(size, 10) : undefined,
    };
  
    console.log("📡 Sending search request with:", params);
  
    try {
      const data: MyPet[] = await search(params);
      console.log("✅ Search Results:", data);
  
      const normalizedResults = data.map((pet, index) => ({
        id: pet.report_id ? Number(pet.report_id) : index + 1,
        animal_id: pet.animal_id ? Number(pet.animal_id) : pet.id,
        report_id: pet.report_id || `temp-${index + 1}`,
        name: pet.name_en || "Unnamed Pet",
        description: pet.desc || "No description provided",
        image: pet.image
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${pet.image.startsWith("/") ? pet.image : `/${pet.image}`}`
          : "/assets/default-pet.jpg",
        badgeType: (pet.report_type === 1 ? "Lost" : "Found") as "Lost" | "Found",
        report_type: pet.report_type.toString(),
        location: pet.location || "",
        date: pet.report_date
          ? new Date(pet.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "N/A",
        status: (pet.animal_status === 4 ? "Reunited" : "Active") as "Reunited" | "Active",
        reward: pet.reward || undefined,
        breed_id: pet.breed_id.toString(),
        species: pet.species.toString(),
        sex: pet.sex || "",
        size: pet.size.toString(),
        distinguishing_features: pet.distinguishing_features || "",
        date_lost: pet.date_lost || "",
        nearest_address_last_seen: pet.nearest_address_last_seen || "",
        date_found: pet.date_found || "",
        where_pet_was_found: pet.where_pet_was_found || "",
        condition: pet.condition || "",
        additional_details: pet.additional_details || "",
        owner_name: pet.owner_name || "",
        contact_email: pet.contact_email || "",
        phone_number: pet.phone_number || "",
      }));
  
      onSearchResults(normalizedResults);
    } catch (error) {
      console.error("❌ Search failed:", error);
      onSearchResults(null);
    }
  };
  

  return (
    <div className="flex justify-center items-center lg:flex lg:flex-1 mx-4 p-2">
      <div className="max-w-[500px] w-full">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="relative flex flex-col sm:flex-row items-center mx-auto w-full gap-3 sm:gap-4">
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full sm:w-[150px] h-10 sm:h-12 px-4 text-black bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ease-in-out"
            >
              <option value="">Select Breed</option>
              <option value="1">Labrador</option>
              <option value="2">Bulldog</option>
              <option value="3">Beagle</option>
            </select>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="w-full sm:w-[150px] h-10 sm:h-12 px-4 text-black bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ease-in-out"
            >
              <option value="">Species</option>
              <option value="">Dog</option>
              <option value="">Cat</option>
              <option value="">Bird</option>
            </select>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full sm:w-[150px] h-10 sm:h-12 px-4 text-black bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ease-in-out"
            >
              <option value="">Select Size</option>
              <option value="">Small</option>
              <option value="">Medium</option>
              <option value="">Large</option>
            </select>
            <button
              onClick={handleSearch}
              disabled={!breed && !species && !size}
              className="w-full sm:w-auto px-8 h-10 sm:h-12 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 ease-in-out shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5 mr-2" /> Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}