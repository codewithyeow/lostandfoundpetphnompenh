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
  BookmarkPlus,
} from "lucide-react";
import {
  fetchMyPet,
  fetchMyFavorite,
  removeFromFavorite,
  updateMarkReunitedStatus,
  fetchAllReport,
  updateMarkActiveStatus,
} from "@server/actions/animal-action";
import ProfileSection from "../page-sections/ProfileSection";

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
  animal_status: number;
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
  onMarkAsReunited?: (animal_id: number) => void;
  onMarkAsActive?: (animal_id: number) => void;
  onRemoveFromWishlist?: (animal_id: number) => void;
}> = ({
  pet,
  type,
  onEdit,
  onDetail,
  onMarkAsReunited,
  onRemoveFromWishlist,
  onMarkAsActive,
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
        pet.animal_status === 4 ? "opacity-75" : ""
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4eb7f0]"></div>
      <Badge
        variant="default"
        className={`absolute top-3 left-3 z-10 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md ${
          pet.badgeType === "Lost" ? "bg-red-500" : "bg-[#8DC63F]"
        }`}
      >
        {pet.animal_status === 4 ? "Reunited" : pet.badgeType}
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
          {pet.animal_status === 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
              <span className="bg-[#8DC63F] text-white px-4 py-2 rounded-full font-semibold">
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
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsReunited?.(pet.animal_id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pet.animal_status === 4
                      ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      : "bg-[#8DC63F] text-white hover:bg-green-600"
                  }`}
                >
                  <RefreshCw size={14} />
                  {pet.animal_status === 4
                    ? "Mark as Active"
                    : "Mark as Reunited"}
                </button> */}
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
  animal_status: number;
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

// PetCard component remains unchanged

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
    const fetchAllData = async () => {
      try {
        setLoadingPets(true);
        setLoadingWishlist(true);

        const [myPetsResponse, allReportsResponse, favoritesResponse] =
          await Promise.all([
            fetchMyPet(),
            fetchAllReport(),
            fetchMyFavorite(),
          ]);

        console.log("Favorites Response:", favoritesResponse);

        // Create a map of all reports to cross-reference report_type
        const allReportsMap = new Map<string, string>(
          allReportsResponse.success
            ? (allReportsResponse.result ?? []).map((pet: any) => [
                pet.id?.toString() || pet.report_id,
                pet.report_type?.toString(),
              ])
            : []
        );

        const normalizePet = (pet: any, index: number): PetReport => {
          const petId =
            pet.id?.toString() ||
            pet.report_id ||
            pet.pivot?.model_id?.toString();
          const reportType =
            pet.report_type?.toString() ||
            allReportsMap.get(petId) ||
            (pet.image?.includes("lost")
              ? "1"
              : pet.image?.includes("found")
              ? "2"
              : "1");
          const badgeType = reportType === "1" ? "Lost" : "Found"; // Explicitly type-safe

          return {
            id: pet.id
              ? Number(pet.id)
              : pet.report_id
              ? Number(pet.report_id)
              : index + 1,
            animal_id: pet.id
              ? Number(pet.id)
              : pet.pivot?.model_id
              ? Number(pet.pivot.model_id)
              : index + 1,
            report_id: petId || `temp-${index + 1}`,
            name: pet.name_en || "Unnamed Pet",
            description: pet.desc || "No description provided",
            image: pet.image
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${
                  pet.image.startsWith("/") ? pet.image : `/${pet.image}`
                }`
              : "/assets/default-pet.jpg",
            report_type: reportType,
            badgeType: badgeType, // Now guaranteed to be "Lost" or "Found"
            location: pet.location || "",
            date: pet.report_date
              ? new Date(pet.report_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A",
            animal_status: pet.animal_status === 4 ? 4 : pet.animal_status,
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
          };
        };

        const myPetsData = myPetsResponse.success
          ? (myPetsResponse.result ?? []).map(normalizePet)
          : [];
        const allReportsData = allReportsResponse.success
          ? (allReportsResponse.result ?? []).map(normalizePet)
          : [];
        const wishlistData = favoritesResponse.success
          ? (favoritesResponse.result ?? []).map((pet, index) =>
              normalizePet(pet, index)
            )
          : [];

        const combinedPets = [...myPetsData, ...allReportsData].reduce(
          (unique: PetReport[], pet: PetReport) =>
            unique.some((p) => p.report_id === pet.report_id)
              ? unique
              : [...unique, pet],
          [] as PetReport[]
        );

        setMyPets(combinedPets);
        setWishlist(wishlistData);
        setTotalPagesPets(Math.ceil(combinedPets.length / petsPerPage));
        setTotalPagesWishlist(Math.ceil(wishlistData.length / petsPerPage));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoadingPets(false);
        setLoadingWishlist(false);
      }
    };

    fetchAllData();
  }, []);

  const handleDetailReport = (pet: PetReport) => {
    const detailPath =
      pet.report_type === "1"
        ? `/pet-detail-lost/${pet.report_id}?from=dashboard`
        : `/pet-detail-found/${pet.report_id}?from=dashboard`;
    console.log("Navigating to:", detailPath);
    router.push(detailPath);
  };

  const handleEditReport = (pet: PetReport) => {
    const editPath =
      pet.report_type === "1"
        ? `/pet-edit-lost/${pet.report_id}`
        : `/pet-edit-found/${pet.report_id}`;
    router.push(editPath);
  };

  const handleToggleStatus = async (
    animal_id: number,
    currentStatus: 1 | 4
  ) => {
    try {
      const newStatus = currentStatus === 4 ? 1 : 4;

      // Optimistically update UI
      setMyPets((prevPets) =>
        prevPets.map((pet) =>
          pet.animal_id === animal_id
            ? { ...pet, animal_status: newStatus }
            : pet
        )
      );

      // API call based on the new status
      const response =
        newStatus === 4
          ? await updateMarkReunitedStatus(animal_id)
          : await updateMarkActiveStatus(animal_id);

      if (!response.success) {
        // Revert if API call fails
        setMyPets((prevPets) =>
          prevPets.map((pet) =>
            pet.animal_id === animal_id
              ? { ...pet, animal_status: currentStatus }
              : pet
          )
        );
        console.error(`Failed to update pet status:`, response.message);
      } else {
        console.log(
          `Pet ${animal_id} status updated successfully to ${newStatus}`
        );
      }
    } catch (error) {
      // Rollback on network error
      setMyPets((prevPets) =>
        prevPets.map((pet) =>
          pet.animal_id === animal_id
            ? { ...pet, animal_status: currentStatus }
            : pet
        )
      );
      console.error("Error in handleToggleStatus:", error);
    }
  };

  const removeFromWishlist = async (animal_id: number) => {
    try {
      setLoadingWishlist(true);
      const response = await removeFromFavorite(animal_id);
      if (response.success) {
        const updatedWishlistResponse = await fetchMyFavorite();
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
              animal_status: pet.animal_status || 0, // Ensure animal_status is included
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
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handlePageChangePets = (newPage: number) => {
    setCurrentPagePets(newPage);
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

  const getVisiblePages = (currentPage: number, totalPages: number) => {
    const maxVisible = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-6xl mx-auto">
        <ProfileSection />
        <Tabs defaultValue="myPets" className="space-y-4">
          <TabsList className="grid grid-cols-2 max-w-2xl mx-auto bg-[#e4e3e7]">
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
                  <div key={pet.animal_id}>
                    <PetCard
                      pet={pet}
                      onEdit={handleEditReport}
                      onDetail={handleDetailReport}
                    />
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          pet.animal_id,
                          pet.animal_status as 1 | 4
                        )
                      }
                      className={`px-4 py-2 rounded text-white ${
                        pet.animal_status === 1 ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {pet.animal_status === 1
                        ? "Mark as Reunited"
                        : "Mark as Active"}
                    </button>
                  </div>
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
                    onClick={() =>
                      currentPagePets > 1 &&
                      handlePageChangePets(currentPagePets - 1)
                    }
                    className={
                      currentPagePets === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  />
                  <PaginationContent>
                    {getVisiblePages(currentPagePets, totalPagesPets).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPagePets === page}
                            onClick={() => handlePageChangePets(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                  </PaginationContent>
                  <PaginationNext
                    onClick={() =>
                      currentPagePets < totalPagesPets &&
                      handlePageChangePets(currentPagePets + 1)
                    }
                    className={
                      currentPagePets === totalPagesPets
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  />
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
                    onClick={() =>
                      currentPageWishlist > 1 &&
                      handlePageChangeWishlist(currentPageWishlist - 1)
                    }
                    className={
                      currentPageWishlist === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  />
                  <PaginationContent>
                    {getVisiblePages(
                      currentPageWishlist,
                      totalPagesWishlist
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPageWishlist === page}
                          onClick={() => handlePageChangeWishlist(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  <PaginationNext
                    onClick={() =>
                      currentPageWishlist < totalPagesWishlist &&
                      handlePageChangeWishlist(currentPageWishlist + 1)
                    }
                    className={
                      currentPageWishlist === totalPagesWishlist
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  />
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
