import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import Image from "next/image";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  RefreshCw,
  MapPin,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

const petData = [
  {
    id: 1,
    name: "Fluffy",
    description:
      "Fluffy is a friendly dog who loves playing in the park. He went missing near the city center.",
    image: "/assets/image.jpg",
    badgeType: "Lost",
    location: "City Center",
    date: "Feb 24, 2025",
    status: "Active",
  },
  {
    id: 2,
    name: "Bella",
    description:
      "Bella is a calm and gentle cat. She has been lost since last Wednesday.",
    image: "/assets/image1.jpg",
    badgeType: "Lost",
    location: "Riverside Park",
    date: "Feb 21, 2025",
    status: "Active",
  },
  {
    id: 3,
    name: "Max",
    description:
      "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/image2.jpg",
    badgeType: "Found",
    location: "Downtown",
    date: "Feb 25, 2025",
    status: "Active",
  },
  {
    id: 4,
    name: "Buddy",
    description:
      "Buddy was found wandering around the street. Looking for his owner.",
    image: "/assets/image3.jpg",
    badgeType: "Found",
    location: "Oak Street",
    date: "Feb 22, 2025",
    status: "Reunited",
  },
  {
    id: 5,
    name: "Whiskers",
    description:
      "Whiskers is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image5.jpg",
    badgeType: "Stray",
    location: "Maple Avenue",
    date: "Feb 26, 2025",
    status: "Active",
  },
  {
    id: 6,
    name: "Ching Chang",
    description:
      "Ching Chang is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image4.jpg",
    badgeType: "Stray",
    location: "Pine District",
    date: "Feb 23, 2025",
    status: "Active",
  },
];

const MyPet = () => {
  const [loading, setLoading] = useState(true);
  const [myPets, setMyPets] = useState(petData);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Function to mark the pet as reunited
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

  // Function to handle editing (this could link to an edit page or modal)
  const handleEdit = (id: number) => {
    alert(`Editing pet with ID: ${id}`);
  };

  return (
    <section className="w-full bg-[#EFEEF1] px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-center text-[#4eb7f0] text-2xl font-bold mb-2 flex items-center justify-center">
          <div className="h-px w-16 bg-[#4eb7f0] mr-4"></div>
          MY PET POSTS
          <div className="h-px w-16 bg-[#4eb7f0] ml-4"></div>
        </h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto">
          Manage your pet listings and update their status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {loading
          ? // Show skeleton loaders while loading
            Array(6)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="relative bg-white shadow-md rounded-xl overflow-hidden w-full transition-all duration-300"
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
          : // Show actual pet data when loading is complete
            myPets.map((pet) => (
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
                    : "bg-yellow-500"
                }`}
                >
                  {pet.status === "Reunited" ? "Reunited" : pet.badgeType}
                </Badge>

                <CardContent className="p-0">
                  <div className="relative w-full h-40 sm:h-64 overflow-hidden">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-500"
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
                        onClick={() => handleEdit(pet.id)}
                        className="p-1 text-gray-400 hover:text-[#4eb7f0] transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </CardTitle>

                    <div className="flex flex-wrap text-xs text-gray-500 mb-2">
                      <div className="flex items-center mr-3">
                        <MapPin size={12} className="mr-1 text-[#4eb7f0]" />
                        <span>{pet.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1 text-[#4eb7f0]" />
                        <span>{pet.date}</span>
                      </div>
                    </div>

                    <CardDescription className="text-sm line-clamp-2 mb-4 text-gray-600">
                      {pet.description}
                    </CardDescription>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markAsReunited(pet.id)}
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
                        onClick={() => handleEdit(pet.id)}
                        className="p-2 border border-gray-200 rounded-full text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white hover:border-[#4eb7f0] transition-colors duration-200"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
};

export default MyPet;
