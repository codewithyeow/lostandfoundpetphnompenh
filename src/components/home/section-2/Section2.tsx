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
import { fetchMyPet, fetchAllReport, addToFavorite, fetchMyFavorite, removeFromFavorite } from "@server/actions/animal-action";

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

export default function Section2() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [petData, setPetData] = useState<PetReport[]>([]);
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>({});
  const [visibleCount, setVisibleCount] = useState(9); // Initial 9 cards
  const petsPerLoad = 9; // Load 9 more each time
  const hasFetched = useRef(false);

  // Fetch initial favorites from the server
  const fetchFavorites = async () => {
    try {
      const response = await fetchMyFavorite();
      if (response.success) {
        const favoriteIds = (response.result ?? []).map((pet) =>
          pet.animal_id ? Number(pet.animal_id) : pet.id ? Number(pet.id) : 0
        ).filter(id => id > 0);
        setFavorites(favoriteIds);
        console.log("Initial favorites loaded:", favoriteIds);
      } else {
        console.error("Failed to fetch favorites:", response.message);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchPetData = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    console.log("Fetching pet data...");
    setLoading(true);
    try {
      const myPetsResponse = await fetchMyPet();
      const myPets = myPetsResponse.success
        ? (myPetsResponse.result ?? []).map((pet, index) => ({
            id: pet.report_id ? Number(pet.report_id) : index + 1,
            animal_id: pet.animal_id ? Number(pet.animal_id) : index + 1,
            report_id: pet.report_id || `temp-${index + 1}`,
            name: pet.name_en || "Unnamed Pet",
            description: pet.desc || "No description provided",
            image: pet.image
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${pet.image.startsWith("/") ? pet.image : `/${pet.image}`}`
              : "/assets/default-pet.jpg",
            badgeType: (pet.report_type === 1 ? "Lost" : "Found") as "Lost" | "Found",
            report_type: pet.report_type?.toString() || "1",
            location: pet.location || "",
            date: pet.report_date
              ? new Date(pet.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "N/A",
            status: (pet.animal_status === 1 ? "Active" : "Reunited") as "Active" | "Reunited",
            reward: pet.reward || undefined,
            breed_id: pet.breed_id?.toString() || "",
            species: pet.species?.toString() || "",
            sex: pet.sex?.toString() || "",
            size: pet.size?.toString() || "",
            distinguishing_features: pet.distinguishing_features || "",
            date_lost: pet.date_lost || "",
            nearest_address_last_seen: pet.nearest_address_last_seen || "",
            date_found: pet.date_found || "",
            where_pet_was_found: pet.where_pet_was_found || "",
            condition: pet.condition?.toString() || "",
            additional_details: pet.additional_details || "",
            owner_name: pet.owner_name || "",
            contact_email: pet.contact_email || "",
            phone_number: pet.phone_number || "",
          }))
        : [];

      const allReportsResponse = await fetchAllReport();
      const allReports = allReportsResponse.success
        ? (allReportsResponse.result ?? []).map((pet, index) => ({
            id: pet.report_id ? Number(pet.report_id) : index + myPets.length + 1,
            animal_id: pet.animal_id ? Number(pet.animal_id) : index + myPets.length + 1,
            report_id: pet.report_id || `temp-${index + myPets.length + 1}`,
            name: pet.name_en || "Unnamed Pet",
            description: pet.desc || "No description provided",
            image: pet.image
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${pet.image.startsWith("/") ? pet.image : `/${pet.image}`}`
              : "/assets/default-pet.jpg",
            badgeType: (pet.report_type === 1 ? "Lost" : "Found") as "Lost" | "Found",
            report_type: pet.report_type?.toString() || "1",
            location: pet.location || "",
            date: pet.report_date
              ? new Date(pet.report_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "N/A",
            status: (pet.animal_status === 1 ? "Active" : "Reunited") as "Active" | "Reunited",
            reward: pet.reward || undefined,
            breed_id: pet.breed_id?.toString() || "",
            species: pet.species?.toString() || "",
            sex: pet.sex?.toString() || "",
            size: pet.size?.toString() || "",
            distinguishing_features: pet.distinguishing_features || "",
            date_lost: pet.date_lost || "",
            nearest_address_last_seen: pet.nearest_address_last_seen || "",
            date_found: pet.date_found || "",
            where_pet_was_found: pet.where_pet_was_found || "",
            condition: pet.condition?.toString() || "",
            additional_details: pet.additional_details || "",
            owner_name: pet.owner_name || "",
            contact_email: pet.contact_email || "",
            phone_number: pet.phone_number || "",
          }))
        : [];

      const combinedPets = [...myPets, ...allReports].reduce(
        (unique: PetReport[], pet: PetReport) =>
          unique.some((p) => p.report_id === pet.report_id) ? unique : [...unique, pet],
        []
      );

      console.log("Combined Pets:", combinedPets);
      setPetData(combinedPets);

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
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchFavorites();
      await fetchPetData();
    };
    initializeData();
  }, []);

  const toggleFavorite = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    const pet = petData.find((p) => p.id === id);
    const animalId = pet?.animal_id;
    if (!animalId) {
      console.error("No animal_id found for pet:", pet);
      return;
    }

    const isFavorited = favorites.includes(animalId);

    try {
      if (isFavorited) {
        const response = await removeFromFavorite(animalId);
        if (response.success) {
          setFavorites((prev) => prev.filter((favId) => favId !== animalId));
          console.log(`Pet with animal_id ${animalId} removed from favorites successfully`);
        } else {
          console.error("Failed to remove from favorites:", response.message);
        }
      } else {
        const response = await addToFavorite(animalId);
        if (response.success) {
          setFavorites((prev) => [...prev, animalId]);
          console.log(`Pet with animal_id ${animalId} added to favorites successfully`);
        } else {
          console.error("Failed to add to favorites:", response.message);
        }
      }
    } catch (error) {
      console.error(`Error ${isFavorited ? "removing from" : "adding to"} favorites:`, error);
    }
  };

  const handleImageError = (id: number, petName: string) => {
    console.log(`Image failed for ${petName} (ID: ${id}), switching to fallback`);
    setImageSources((prev) => ({
      ...prev,
      [id]: "/assets/default-pet.jpg",
    }));
  };

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + petsPerLoad); // Load 9 more
  };

  const visiblePets = petData.slice(0, visibleCount); // Only show up to visibleCount

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
          Array(9) // Show 9 skeletons initially
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
          visiblePets.map((pet) => (
            <Link
              href={
                pet.report_type === "1"
                  ? `/pet-detail-lost/${pet.report_id}`
                  : `/pet-detail-found/${pet.report_id}`
              }
              key={pet.id}
              passHref
            >
              <Card className="relative bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 w-full group cursor-pointer">
                <button
                  onClick={(e) => toggleFavorite(e, pet.id)}
                  className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md transition-transform hover:scale-110"
                >
                  <Heart
                    size={20}
                    className={favorites.includes(pet.animal_id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>

                <Badge
                  variant="default"
                  className={`absolute top-3 left-3 z-10 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md ${
                    pet.badgeType === "Lost" ? "bg-red-500" : "bg-[#8DC63F]"
                  }`}
                >
                  {pet.badgeType}
                </Badge>

                <CardContent className="p-0">
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                    <Image
                      src={imageSources[pet.id] || pet.image}
                      alt={`${pet.name} - ${pet.badgeType} pet`}
                      layout="fill"
                      objectFit="cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(pet.id, pet.name)}
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
                        href={
                          pet.report_type === "1"
                            ? `/pet-detail-lost/${pet.report_id}#contact`
                            : `/pet-detail-found/${pet.report_id}#contact`
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200 text-center"
                      >
                        CONTACT OWNER
                      </Link>
                      <Link
                        href={
                          pet.report_type === "1"
                            ? `/pet-detail-lost/${pet.report_id}`
                            : `/pet-detail-found/${pet.report_id}`
                        }
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

      {/* See More Button */}
      {!loading && petData.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSeeMore}
            className="px-6 py-3 bg-[#4eb7f0] text-white font-medium rounded-full hover:bg-[#3ea0d8] transition-colors duration-200"
          >
            See More
          </button>
        </div>
      )}
    </section>
  );
}