"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import Image from "next/image";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Calendar, Info } from "lucide-react";
import Link from "next/link";
import { fetchMyPet, fetchAllReport } from "@server/actions/animal-action";

interface PetReport {
  id: number;
  name: string;
  description: string;
  image: string;
  badgeType: "Lost" | "Found";
  location: string;
  date: string;
  status: "Active" | "Reunited";
  reward?: string;
}

export default function Section2() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [petData, setPetData] = useState<PetReport[]>([]);
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>({}); // Track image sources
  const hasFetched = useRef(false); // Prevent multiple fetches
  const mountCount = useRef(0); // Debug mounts

  // Fetch combined pet data
  const fetchPetData = async () => {
    if (hasFetched.current) {
      console.log("fetchPetData skipped - already fetched");
      return;
    }
    hasFetched.current = true;

    console.log("Fetching pet data...");
    setLoading(true);
    try {
      const myPetsResponse = await fetchMyPet();
      const myPets = myPetsResponse.success
        ? (myPetsResponse.result ?? []).map((pet, index) => {
            const imagePath = pet.image?.startsWith("/") ? pet.image : `/${pet.image}`;
            const imageUrl = pet.image
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${imagePath}`
              : "/assets/default-pet.jpg";
            console.log(`My Pet ${pet.name_en} image URL:`, imageUrl);
            return {
              id: pet.id || index + 1,
              name: pet.name_en || "Unnamed Pet",
              description: pet.desc || "No description provided",
              image: imageUrl,
              badgeType: (pet.report_type === 1 ? "Lost" : "Found") as "Lost" | "Found",
              location: pet.location || "",
              date: pet.report_date
                ? new Date(pet.report_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
              status: (pet.animal_status === 1 ? "Active" : "Reunited") as "Active" | "Reunited",
            };
          })
        : [];

      const allReportsResponse = await fetchAllReport();
      const allReports = allReportsResponse.success
        ? (allReportsResponse.result ?? []).map((pet, index) => {
            const imagePath = pet.image?.startsWith("/") ? pet.image : `/${pet.image}`;
            const imageUrl = pet.image
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${imagePath}`
              : "/assets/default-pet.jpg";
            console.log(`Report ${pet.name_en} image URL:`, imageUrl);
            return {
              id: pet.id || index + myPets.length + 1,
              name: pet.name_en || "Unnamed Pet",
              description: pet.desc || "No description provided",
              image: imageUrl,
              badgeType: (pet.report_type === 1 ? "Lost" : "Found") as "Lost" | "Found",
              location: pet.location || "",
              date: pet.report_date
                ? new Date(pet.report_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
              status: (pet.animal_status === 1 ? "Active" : "Reunited") as "Active" | "Reunited",
            };
          })
        : [];

      const combinedPets = [...myPets, ...allReports].reduce(
        (unique: PetReport[], pet: PetReport) =>
          unique.some((p) => p.id === pet.id) ? unique : [...unique, pet],
        []
      );

      console.log("Combined Pets:", combinedPets);
      setPetData(combinedPets);

      // Initialize image sources
      const initialSources = combinedPets.reduce((acc, pet) => {
        acc[pet.id] = pet.image;
        return acc;
      }, {} as { [key: number]: string });
      setImageSources(initialSources);
    } catch (error) {
      console.error("Error fetching pet data:", error);
      setPetData([]);
    } finally {
      setLoading(false);
      console.log("Fetch complete, loading set to false");
    }
  };

  useEffect(() => {
    mountCount.current += 1;
    console.log(`Section2 mounted ${mountCount.current} times`);
    console.log("useEffect triggered");

    fetchPetData();

    const storedFavorites = localStorage.getItem("petFavorites");
    if (storedFavorites) {
      console.log("Setting favorites from localStorage:", storedFavorites);
      setFavorites(JSON.parse(storedFavorites));
    }

    return () => {
      console.log("Section2 unmounted");
    };
  }, []); // Empty dependency array

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavorites = favorites.includes(id)
      ? favorites.filter((itemId) => itemId !== id)
      : [...favorites, id];

    console.log("Toggling favorite for ID:", id, "New favorites:", newFavorites);
    setFavorites(newFavorites);
    localStorage.setItem("petFavorites", JSON.stringify(newFavorites));
  };

  // Handle image load errors
  const handleImageError = (id: number, petName: string) => {
    console.log(`Image failed for ${petName} (ID: ${id}), switching to fallback`);
    setImageSources((prev) => ({
      ...prev,
      [id]: "/assets/default-pet.jpg",
    }));
  };

  console.log("Section2 rendering, petData length:", petData.length);

  return (
    <section className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center justify-center mb-2">
          <div className="h-1 w-10 bg-[#4eb7f0] mr-3 rounded-full"></div>
          <h2 className="font-bold text-xl text-[#4eb7f0]">LATEST UPDATES</h2>
          <div className="h-1 w-10 bg-[#4eb7f0] ml-3 rounded-full"></div>
        </div>
        <p className="text-center text-gray-500 max-w-2xl mx-auto">
          Help reunite pets with their owners or find homes for strays in your community
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="relative bg-white shadow-lg rounded-2xl overflow-hidden">
                <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                <CardContent className="p-0">
                  <Skeleton className="w-full h-56 sm:h-64" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-[50%] rounded-md" />
                    <div className="flex mt-3 mb-3">
                      <Skeleton className="h-4 w-[40%] rounded-md mr-2" />
                      <Skeleton className="h-4 w-[40%] rounded-md" />
                    </div>
                    <Skeleton className="mt-2 h-4 w-full rounded-md" />
                    <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                    <div className="mt-5">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : petData.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No pet reports available yet.
          </p>
        ) : (
          petData.map((pet) => (
            <Link href={`/pet-detail/${pet.id}`} key={pet.id} passHref>
              <Card className="relative bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 w-full group cursor-pointer">
                <button
                  onClick={(e) => toggleFavorite(e, pet.id)}
                  className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
                >
                  <Heart
                    size={20}
                    className={favorites.includes(pet.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>

                <Badge
                  variant="default"
                  className={`absolute top-3 left-3 z-10 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md ${
                    pet.badgeType === "Lost"
                      ? "bg-red-500"
                      : pet.badgeType === "Found"
                      ? "bg-[#8DC63F]"
                      : "bg-yellow-500"
                  }`}
                >
                  {pet.badgeType}
                </Badge>

                <CardContent className="p-0">
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                    <Image
                      src={imageSources[pet.id] || pet.image} // Use state-managed source
                      alt={`${pet.name} - ${pet.badgeType} pet`}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(pet.id, pet.name)} // Update state on error
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-5">
                    <CardTitle className="text-lg sm:text-xl font-bold">{pet.name}</CardTitle>
                    <div className="flex flex-wrap text-sm text-gray-500 mt-2 mb-3">
                      <div className="flex items-center mr-4 mb-2">
                        <MapPin size={14} className="mr-1 text-[#4eb7f0]" />
                        <span>{pet.location || "Unknown"}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Calendar size={14} className="mr-1 text-[#4eb7f0]" />
                        <span>{pet.date || "N/A"}</span>
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-2 mb-5">
                      {pet.description || "No description available"}
                    </CardDescription>
                    <div className="flex justify-between items-center gap-2">
                      <Link
                        href={`/pets/${pet.id}#contact`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200 text-center"
                      >
                        CONTACT OWNER
                      </Link>
                      <Link
                        href={`/pets/${pet.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 border-2 border-gray-200 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                      >
                        <Info size={18} className="text-gray-500" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}