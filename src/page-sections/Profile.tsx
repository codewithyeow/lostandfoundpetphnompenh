"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "../components/ui/badge";
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
} from "lucide-react";
import { fetchMyPet } from "@server/actions/animal-action";
import ProfileSection from "../page-sections/ProfileSection";
import {editReportLostPet } from "@server/actions/animal-action";
import {EditReportLostParams} from "../context/petFoundType";

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

// New PetCard Component
const PetCard: React.FC<{ pet: PetReport; type?: "wishlist"; onEdit: (id: number) => void; onMarkAsReunited?: (id: number) => void; onRemoveFromWishlist?: (id: number) => void }> = ({
  pet,
  type,
  onEdit,
  onMarkAsReunited,
  onRemoveFromWishlist,
}) => {
  const [imageSrc, setImageSrc] = useState(pet.image);

  return (
    <Card
      key={pet.id}
      className={`relative bg-white shadow-md rounded-xl overflow-hidden w-full transition-all duration-300 ${
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
        <div className="relative w-full h-40 sm:h-48 overflow-hidden">
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
              onClick={() => onEdit(pet.id)}
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
                onClick={() => onRemoveFromWishlist?.(pet.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <Heart size={14} />
                Remove from Wishlist
              </button>
            ) : (
              <>
                <button
                  onClick={() => onMarkAsReunited?.(pet.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pet.status === "Reunited"
                      ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <RefreshCw size={14} />
                  {pet.status === "Reunited" ? "Mark as Active" : "Mark as Reunited"}
                </button>
                <button
                  onClick={() => onEdit(pet.id)}
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


  useEffect(() => {
    const fetchPetReports = async () => {
      try {
        setLoadingPets(true);
        const response = await fetchMyPet();
        const pets = response.success
          ? (response.result ?? []).map((pet, index) => {
              const imagePath = pet.image.startsWith('/')
                ? pet.image
                : `/${pet.image}`;
              const imageUrl = pet.image
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${imagePath}`
                : "/assets/default-pet.jpg";
              console.log(`Pet ${pet.name_en} image URL:`, imageUrl);
              return {
                id: index + 1,
                name: pet.name_en,
                description: pet.desc || "No description provided",
                image: imageUrl,
                badgeType: (pet.report_type === 1 ? "Lost" : "Found") as "Lost" | "Found",
                location: "",
                date: new Date(pet.report_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                status: (pet.animal_status === 1 ? "Active" : "Reunited") as "Active" | "Reunited",
              };
            })
          : [];
        setMyPets(pets);
        setTotalPagesPets(Math.ceil(pets.length / petsPerPage));
      } catch (error) {
        console.error("Failed to fetch pet reports:", error);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPetReports();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoadingWishlist(true);
        const mockWishlist: PetReport[] = [
          { id: 1, name: "Buddy", description: "A friendly golden retriever found wandering.", image: "/assets/default-pet.jpg", badgeType: "Found", location: "Central Park", date: "Mar 15, 2025", status: "Active" },
          { id: 2, name: "Luna", description: "Lost tabby cat, very shy.", image: "/assets/default-pet.jpg", badgeType: "Lost", location: "Downtown", date: "Mar 20, 2025", status: "Active", reward: "50" },
          { id: 3, name: "Max", description: "Found husky", image: "/assets/default-pet.jpg", badgeType: "Found", location: "Suburbs", date: "Mar 22, 2025", status: "Active" },
          { id: 4, name: "Bella", description: "Lost poodle", image: "/assets/default-pet.jpg", badgeType: "Lost", location: "City Center", date: "Mar 23, 2025", status: "Active" },
          { id: 5, name: "Charlie", description: "Found beagle", image: "/assets/default-pet.jpg", badgeType: "Found", location: "Riverside", date: "Mar 24, 2025", status: "Active" },
          { id: 6, name: "Daisy", description: "Lost siamese", image: "/assets/default-pet.jpg", badgeType: "Lost", location: "Uptown", date: "Mar 25, 2025", status: "Active" },
          { id: 7, name: "Rocky", description: "Found boxer", image: "/assets/default-pet.jpg", badgeType: "Found", location: "East Side", date: "Mar 26, 2025", status: "Active" },
          { id: 8, name: "Milo", description: "Lost shih tzu", image: "/assets/default-pet.jpg", badgeType: "Lost", location: "West Side", date: "Mar 27, 2025", status: "Active" },
          { id: 9, name: "Zoe", description: "Found labrador", image: "/assets/default-pet.jpg", badgeType: "Found", location: "North End", date: "Mar 28, 2025", status: "Active" },
          { id: 10, name: "Oliver", description: "Lost persian", image: "/assets/default-pet.jpg", badgeType: "Lost", location: "South End", date: "Mar 29, 2025", status: "Active" },
        ];
        setWishlist(mockWishlist);
        setTotalPagesWishlist(Math.ceil(mockWishlist.length / petsPerPage));
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoadingWishlist(false);
      }
    };
    fetchWishlist();
  }, []);

  const markAsReunited = (id: number) => {
    setMyPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === id
          ? { ...pet, status: pet.status === "Reunited" ? "Active" : "Reunited" }
          : pet
      )
    );
  };

  const handlePageChangePets = (newPage: number) => {
    setCurrentPagePets(newPage);
  };

  // Function to handle editing (this could link to an edit page or modal)
  const handleEditReport = async (id: number) => {
    const params: EditReportLostParams = {
      report_id: "1",
      report_type: "1",
      animal_name: "new_name8",
      breed_id: "1",
      species: "2",
      sex: "1",
      size: "3",
      distinguishing_features: "ad",
      date_lost: "3/29/2025",
      nearest_address_last_seen: "FA",
      additional_details: "d",
      owner_name: "unknown",
      contact_email: "kim@gmail.com",
      phone_number: "123",
      reward: "500 $",
    };
  
    const response = await editReportLostPet(params);
    if (response.success) {
      console.log("Report updated successfully:", response.message);
    } else {
      console.error("Failed to update report:", response.message, response.errors);
    }
  };
  const removeFromWishlist = (id: number) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((pet) => pet.id !== id);
      setTotalPagesWishlist(Math.ceil(updatedWishlist.length / petsPerPage));
      return updatedWishlist;
    });
  };

  const handlePageChangeWishlist = (newPage: number) => {
    setCurrentPageWishlist(newPage);
  };

  const indexOfLastPet = currentPagePets * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = myPets.slice(indexOfFirstPet, indexOfLastPet);

  const indexOfLastWishlist = currentPageWishlist * petsPerPage;
  const indexOfFirstWishlist = indexOfLastWishlist - petsPerPage;
  const currentWishlist = wishlist.slice(indexOfFirstWishlist, indexOfLastWishlist);

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
                      currentPagePets === 1 ? "opacity-50 cursor-not-allowed" : ""
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
                  <p className="text-gray-500 max-w-md">
                    Save pet listings to your wishlist to keep track of pets you're interested in helping.
                  </p>
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
                      currentPageWishlist === 1 ? "opacity-50 cursor-not-allowed" : ""
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
                      onClick={() => handlePageChangeWishlist(currentPageWishlist + 1)}
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