"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  RefreshCw,
  MapPin,
  Calendar,
  MoreHorizontal,
  Heart,
  User,
  AlertTriangle,
  BookmarkPlus,
  X,
} from "lucide-react";
import {
  fetchMyPet,
  fetchMyFavorite,
  removeFromFavorite,
} from "@server/actions/animal-action";
import ProfileSection from "../page-sections/ProfileSection";

interface PetReport {
  id: number; // report_id or unique identifier for UI
  animal_id: number; // The ID used for favorites (e.g., pivot.model_id or id from API)
  report_id: string;
  name: string;
  description: string;
  image: string;
  badgeType: "Lost" | "Found";
  report_type: string; // "1" for Lost, "2" for Found
  location: string;
  date: string;
  status: "Active" | "Reunited";
  reward?: string;
  breed_id: string;
  species: string;
  sex: string;
  size: string;
  distinguishing_features: string;
  date_lost: string;
  nearest_address_last_seen: string;
  additional_details: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
}

const PetCard: React.FC<{
  pet: PetReport;
  type?: "wishlist";
  onEdit: (pet: PetReport) => void;
  onDetail: (pet: PetReport) => void;
  onMarkAsReunited?: (id: number) => void;
  onRemoveFromWishlist?: (animal_id: number) => void;
}> = ({
  pet,
  type,
  onEdit,
  onDetail,
  onMarkAsReunited,
  onRemoveFromWishlist,
}) => {
  const [imageSrc, setImageSrc] = useState(pet.image);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDetail(pet);
  };

  return (
    <Card
      key={pet.report_id}
      className={`relative bg-white shadow-md rounded-xl overflow-hidden w-full transition-all duration-300 hover:shadow-lg ${
        pet.status === "Reunited" ? "opacity-75" : ""
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4eb7f0]"></div>
      <Badge
        variant="default"
        className={`absolute top-3 left-3 z-10 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md ${
          pet.badgeType === "Lost"
            ? "bg-red-500"
            : pet.badgeType === "Found"
            ? "bg-[#8DC63F]"
            : "bg-orange-500"
        }`}
      >
        {pet.status === "Reunited" ? "Reunited" : pet.badgeType}
      </Badge>
      <CardContent className="p-0">
        <div
          className="relative w-full h-40 sm:h-48 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={imageSrc}
            alt={pet.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageSrc("/assets/default-pet.jpg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gray-100/80 -z-10"></div>
          {pet.status === "Reunited" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                REUNITED
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <CardTitle className="text-lg font-bold mb-1 flex items-center justify-between">
            <span>{pet.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(pet);
              }}
              className="p-1 text-gray-400 hover:text-[#4eb7f0] transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
          </CardTitle>
          <div className="flex flex-wrap text-xs text-gray-500 mb-2">
            <div className="flex items-center mr-3">
              <MapPin size={12} className="mr-1 text-[#4eb7f0]" />
              <span>{pet.location || "Location not provided"}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={12} className="mr-1 text-[#4eb7f0]" />
              <span>{pet.date}</span>
            </div>
          </div>
          <CardDescription className="text-sm line-clamp-2 mb-4 text-gray-600">
            {pet.description}
          </CardDescription>
          {pet.reward && pet.badgeType === "Lost" && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-700">Reward: ${pet.reward}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            {type === "wishlist" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromWishlist?.(pet.animal_id);
                }}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <Heart size={14} />
                Remove from Wishlist
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsReunited?.(pet.id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pet.status === "Reunited"
                      ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <RefreshCw size={14} />
                  {pet.status === "Reunited"
                    ? "Mark as Active"
                    : "Mark as Reunited"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(pet);
                  }}
                  className="p-2 border border-gray-200 rounded-full text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white hover:border-[#4eb7f0] transition-colors duration-200"
                >
                  <Edit size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardProfile() {
  const [loadingPets, setLoadingPets] = useState(true);
  const [myPets, setMyPets] = useState<PetReport[]>([]);
  const [currentPagePets, setCurrentPagePets] = useState(1);
  const [totalPagesPets, setTotalPagesPets] = useState(1);
  const petsPerPage = 6;

  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [wishlist, setWishlist] = useState<PetReport[]>([]);
  const [currentPageWishlist, setCurrentPageWishlist] = useState(1);
  const [totalPagesWishlist, setTotalPagesWishlist] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchPetReports = async () => {
      try {
        setLoadingPets(true);
        const response = await fetchMyPet();
        const pets = response.success
          ? (response.result ?? []).map((pet, index) => ({
              id: pet.report_id ? Number(pet.report_id) : index + 1,
              animal_id: pet.id ? Number(pet.id) : index + 1, // Use id from API as animal_id
              report_id: pet.report_id || `temp-${index + 1}`,
              name: pet.name_en || "Unnamed Pet",
              description: pet.desc || "No description provided",
              image: pet.image
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${
                    pet.image.startsWith("/") ? pet.image : `/${pet.image}`
                  }`
                : "/assets/default-pet.jpg",
              badgeType: (pet.report_type === 1 ? "Lost" : "Found") as
                | "Lost"
                | "Found",
              report_type: pet.report_type?.toString() || "1",
              location: pet.location || "",
              date: pet.report_date
                ? new Date(pet.report_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
              status: (pet.animal_status === 1 ? "Active" : "Reunited") as
                | "Active"
                | "Reunited",
              reward: pet.reward || undefined,
              breed_id: pet.breed_id?.toString() || "",
              species: pet.species?.toString() || "",
              sex: pet.sex?.toString() || "",
              size: pet.size?.toString() || "",
              distinguishing_features: pet.distinguishing_features || "",
              date_lost: pet.date_lost || "",
              nearest_address_last_seen: pet.nearest_address_last_seen || "",
              additional_details: pet.additional_details || "",
              owner_name: pet.owner_name || "",
              contact_email: pet.contact_email || "",
              phone_number: pet.phone_number || "",
            }))
          : [];
        setMyPets(pets);
        setTotalPagesPets(Math.ceil(pets.length / petsPerPage));
      } catch (error) {
        console.error("Failed to fetch pet reports:", error);
      } finally {
        setLoadingPets(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        setLoadingWishlist(true);
        const response = await fetchMyFavorite();
        console.log("fetchMyFavorite response:", response);
        const wishlistPets = response.success
          ? (response.result ?? []).map((pet, index) => ({
              id: pet.report_id ? Number(pet.report_id) : index + 1,
              animal_id: pet.id
                ? Number(pet.id)
                : pet.pivot?.model_id
                ? Number(pet.pivot.model_id)
                : index + 1, // Use id or pivot.model_id
              report_id: pet.report_id || `temp-${index + 1}`,
              name: pet.name_en || "Unnamed Pet",
              description: pet.desc || "No description provided",
              image: pet.image
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${
                    pet.image.startsWith("/") ? pet.image : `/${pet.image}`
                  }`
                : "/assets/default-pet.jpg",
              badgeType: (pet.report_type === 1 ? "Lost" : "Found") as
                | "Lost"
                | "Found",
              report_type: pet.report_type?.toString() || "1",
              location: pet.location || "",
              date: pet.report_date
                ? new Date(pet.report_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
              status: (pet.status === 1 ? "Active" : "Reunited") as
                | "Active"
                | "Reunited", // Updated to use status
              reward: pet.reward || undefined,
              breed_id: pet.breed_id?.toString() || "",
              species: pet.species?.toString() || "",
              sex: pet.sex?.toString() || "",
              size: pet.size?.toString() || "",
              distinguishing_features: pet.distinguishing_features || "",
              date_lost: pet.date_lost || "",
              nearest_address_last_seen: pet.nearest_address_last_seen || "",
              additional_details: pet.additional_details || "",
              owner_name: pet.owner_name || "",
              contact_email: pet.contact_email || "",
              phone_number: pet.phone_number || "",
            }))
          : [];
        setWishlist(wishlistPets);
        setTotalPagesWishlist(Math.ceil(wishlistPets.length / petsPerPage));
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchPetReports();
    fetchWishlist();
  }, []);

  const markAsReunited = (id: number) => {
    setMyPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === id
          ? {
              ...pet,
              status: pet.status === "Reunited" ? "Active" : "Reunited",
            }
          : pet
      )
    );
  };

  const handlePageChangePets = (newPage: number) => {
    setCurrentPagePets(newPage);
  };

  const handleEditReport = (pet: PetReport) => {
    const editPath =
      pet.report_type === "1"
        ? `/pet-edit-lost/${pet.report_id}`
        : `/pet-edit-found/${pet.report_id}`;
    router.push(editPath);
  };

  const handleDetailReport = (pet: PetReport) => {
    const detailPath =
      pet.report_type === "1"
        ? `/pet-detail-lost/${pet.report_id}?from=dashboard`
        : `/pet-detail-found/${pet.report_id}?from=dashboard`;
    router.push(detailPath);
  };

  const removeFromWishlist = async (animal_id: number) => {
    try {
      setLoadingWishlist(true);
      console.log(`Attempting to remove animal_id ${animal_id} from wishlist`);
      const response = await removeFromFavorite(animal_id);
      if (response.success) {
        const updatedWishlistResponse = await fetchMyFavorite();
        console.log(
          "Updated fetchMyFavorite response:",
          updatedWishlistResponse
        );
        const updatedWishlist = updatedWishlistResponse.success
          ? (updatedWishlistResponse.result ?? []).map((pet, index) => ({
              id: pet.report_id ? Number(pet.report_id) : index + 1,
              animal_id: pet.id
                ? Number(pet.id)
                : pet.pivot?.model_id
                ? Number(pet.pivot.model_id)
                : index + 1,
              report_id: pet.report_id || `temp-${index + 1}`,
              name: pet.name_en || "Unnamed Pet",
              description: pet.desc || "No description provided",
              image: pet.image
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${
                    pet.image.startsWith("/") ? pet.image : `/${pet.image}`
                  }`
                : "/assets/default-pet.jpg",
              badgeType: (pet.report_type === 1 ? "Lost" : "Found") as
                | "Lost"
                | "Found",
              report_type: pet.report_type?.toString() || "1",
              location: pet.location || "",
              date: pet.report_date
                ? new Date(pet.report_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A",
              status: (pet.status === 1 ? "Active" : "Reunited") as
                | "Active"
                | "Reunited",
              reward: pet.reward || undefined,
              breed_id: pet.breed_id?.toString() || "",
              species: pet.species?.toString() || "",
              sex: pet.sex?.toString() || "",
              size: pet.size?.toString() || "",
              distinguishing_features: pet.distinguishing_features || "",
              date_lost: pet.date_lost || "",
              nearest_address_last_seen: pet.nearest_address_last_seen || "",
              additional_details: pet.additional_details || "",
              owner_name: pet.owner_name || "",
              contact_email: pet.contact_email || "",
              phone_number: pet.phone_number || "",
            }))
          : [];
        setWishlist(updatedWishlist);
        setTotalPagesWishlist(Math.ceil(updatedWishlist.length / petsPerPage));
      } else {
        console.error("Failed to remove from wishlist:", response.message);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handlePageChangeWishlist = (newPage: number) => {
    setCurrentPageWishlist(newPage);
  };

  const indexOfLastPet = currentPagePets * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = myPets.slice(indexOfFirstPet, indexOfLastPet);

  const indexOfLastWishlist = currentPageWishlist * petsPerPage;
  const indexOfFirstWishlist = indexOfLastWishlist - petsPerPage;
  const currentWishlist = wishlist.slice(
    indexOfFirstWishlist,
    indexOfLastWishlist
  );

  return (
    <section className="w-full bg-[#EFEEF1] px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        <ProfileSection />
        <Tabs defaultValue="myPets" className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto bg-[#e4e3e7]">
            <TabsTrigger
              value="myPets"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <User size={16} className="mr-2" />
              My Pets
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <Heart size={16} className="mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="reported"
              className="data-[state=active]:bg-[#4eb7f0] data-[state=active]:text-white"
            >
              <AlertTriangle size={16} className="mr-2" />
              Reported
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myPets">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {loadingPets ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="relative bg-white shadow-md rounded-xl overflow-hidden w-full"
                    >
                      <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-5">
                          <Skeleton className="h-6 w-[50%] rounded-md" />
                          <div className="flex mt-3 mb-3">
                            <Skeleton className="h-4 w-[40%] rounded-md mr-2" />
                            <Skeleton className="h-4 w-[40%] rounded-md" />
                          </div>
                          <Skeleton className="mt-2 h-4 w-full rounded-md" />
                          <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                          <div className="mt-5 flex justify-between">
                            <Skeleton className="h-10 w-[48%] rounded-lg" />
                            <Skeleton className="h-10 w-[48%] rounded-lg" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : currentPets.length > 0 ? (
                currentPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={handleEditReport}
                    onDetail={handleDetailReport}
                    onMarkAsReunited={markAsReunited}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-gray-500 text-lg">No pet reports found</p>
                  <p className="text-gray-400">
                    Your lost and found pet reports will appear here
                  </p>
                </div>
              )}
            </div>
            {myPets.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPagePets > 1)
                        handlePageChangePets(currentPagePets - 1);
                    }}
                    className={`${
                      currentPagePets === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  <PaginationContent>
                    {Array.from({ length: totalPagesPets }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPagePets === index + 1}
                          onClick={() => handlePageChangePets(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  {currentPagePets < totalPagesPets && (
                    <PaginationNext
                      onClick={() => handlePageChangePets(currentPagePets + 1)}
                    />
                  )}
                </Pagination>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {loadingWishlist ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card
                      key={index}
                      className="relative bg-white shadow-md rounded-xl overflow-hidden w-full"
                    >
                      <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-5">
                          <Skeleton className="h-6 w-[50%] rounded-md" />
                          <div className="flex mt-3 mb-3">
                            <Skeleton className="h-4 w-[40%] rounded-md mr-2" />
                            <Skeleton className="h-4 w-[40%] rounded-md" />
                          </div>
                          <Skeleton className="mt-2 h-4 w-full rounded-md" />
                          <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                          <div className="mt-5 flex justify-between">
                            <Skeleton className="h-10 w-full rounded-lg" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : currentWishlist.length > 0 ? (
                currentWishlist.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    type="wishlist"
                    onEdit={handleEditReport}
                    onDetail={handleDetailReport}
                    onRemoveFromWishlist={removeFromWishlist}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <div className="text-gray-400 mb-3">
                    <BookmarkPlus size={48} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    Save pet listings to your wishlist to keep track of pets
                    you're interested in helping.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-[#4eb7f0] text-white font-medium rounded-full hover:bg-[#3ea0d8] transition-colors duration-200"
                  >
                    Browse Pet Listings
                  </button>
                </div>
              )}
            </div>
            {wishlist.length > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPageWishlist > 1)
                        handlePageChangeWishlist(currentPageWishlist - 1);
                    }}
                    className={`${
                      currentPageWishlist === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  <PaginationContent>
                    {Array.from({ length: totalPagesWishlist }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPageWishlist === index + 1}
                          onClick={() => handlePageChangeWishlist(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  {currentPageWishlist < totalPagesWishlist && (
                    <PaginationNext
                      onClick={() =>
                        handlePageChangeWishlist(currentPageWishlist + 1)
                      }
                    />
                  )}
                </Pagination>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reported">
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
              <div className="text-gray-400 mb-3">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No Reported Pets
              </h3>
              <p className="text-gray-500 max-w-md">
                There are currently no reports on any of your pet listings.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
