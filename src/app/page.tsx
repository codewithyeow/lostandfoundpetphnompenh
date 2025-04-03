"use client";

import { ThemeProvider } from "styled-components";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const theme = {
  colors: {
    primary: "#8DC63F",
    secondary: "#ff6347",
    danger: "#ff0000",
  },
};

// Dynamically import components
const Section1 = dynamic(() => import("@component/home/section-1/Section1"), {
  ssr: false,
});
const Section2 = dynamic(() => import("@component/home/section-2/Section2"), {
  ssr: false,
});
const SearchSection = dynamic(() => import("@component/home/search-section/Search-Section"), {
  ssr: false,
});

// Define PetReport interface (copied from SearchSection/Section2 for consistency)
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

export default function Home() {
  const [searchResults, setSearchResults] = useState<PetReport[] | null>(null);

  const handleSearchResults = (results: PetReport[] | null) => {
    setSearchResults(results);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen flex flex-col">
        {/* Search Section */}

        {/* Main Content - Ensure it takes full height */}
        <div className="flex-1">
          <Section1 />
          <Section2 searchResults={searchResults} />
        </div>
      </div>
    </ThemeProvider>
  );
}