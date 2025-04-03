import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Flickity from "flickity";
import "flickity/css/flickity.css";
import SearchSection from "../search-section/Search-Section";

interface Pet {
  id: number;
  image: string;
}

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
const carouselItems: Pet[] = [
  {
    id: 1,
    image: "/assets/lost_and_found_pets.jpg",
  },
  {
    id: 2,
    image: "/assets/adoptPet.jpg",
  },
  {
    id: 3,
    image: "/assets/petCarousel3.jpg",
  },
];

export default function Section1() {
  const t = useTranslations("section1");
  const carouselRef = useRef(null);
  const flickityInstance = useRef<Flickity | null>(null);

  useEffect(() => {
    // Initialize Flickity on component mount
    if (carouselRef.current && !flickityInstance.current) {
      flickityInstance.current = new Flickity(carouselRef.current, {
        cellAlign: 'center',
        contain: true,
        wrapAround: true, // Enables infinite scrolling
        autoPlay: 3000, // Auto-plays slides every 3 seconds
        draggable: true, // Enables dragging
        prevNextButtons: false, // Hides default prev/next buttons
        pageDots: false, // We'll use our custom dots
        accessibility: true, // For accessibility
        adaptiveHeight: false,
        imagesLoaded: true, // Ensures proper sizing when images load
      });
    }

    // Clean up Flickity instance on component unmount
    return () => {
      if (flickityInstance.current) {
        flickityInstance.current.destroy();
        flickityInstance.current = null;
      }
    };
  }, []);

  // Update carousel when dot is clicked
  const handleDotClick = (index) => {
    if (flickityInstance.current) {
      flickityInstance.current.select(index);
    }
  };
  const [searchResults, setSearchResults] = useState<PetReport[] | null>(null);

  const handleSearchResults = (results: PetReport[] | null) => {
    setSearchResults(results); // Store results in parent state
    console.log("Search results:", results);
  };
  return (
    <div className="relative w-full">
      {/* SearchSection Component */}
      <div>
      <SearchSection onSearchResults={handleSearchResults} />
      {/* Optionally render results */}
      {searchResults && (
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>{result.name} - {result.species}</li>
          ))}
        </ul>
      )}
    </div>

      {/* Flickity Carousel */}
      <div ref={carouselRef} className="w-full">
        {carouselItems.map((item) => (
          <div 
            key={item.id}
            className="carousel-cell w-full h-[30vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] relative"
          >
            <Image
              src={item.image}
              fill
              className="object-cover"
              priority
              alt={""}
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            />
          </div>
        ))}
      </div>

      {/* Custom Dot Navigation */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {carouselItems.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full cursor-pointer bg-gray-400 hover:bg-gray-600 transition-colors`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
