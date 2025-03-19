"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import Image from "next/image";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Calendar, Info } from "lucide-react";
import Link from "next/link";

export const petData = [
  {
    id: 1,
    name: "Fluffy",
    description:
      "Fluffy is a friendly dog who loves playing in the park. He went missing near the city center.",
    image: "/assets/image.jpg",
    badgeType: "Lost",
    location: "City Center",
    date: "Feb 24, 2025",
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
  },
];

export default function Section2() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Simulate data loading delay
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    
    // Get favorites from localStorage
    const storedFavorites = localStorage.getItem('petFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    return () => clearTimeout(timeout); // Clear timeout when component unmounts
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent card click event from firing
    
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(itemId => itemId !== id) 
      : [...favorites, id];
      
    setFavorites(newFavorites);
    localStorage.setItem('petFavorites', JSON.stringify(newFavorites));
  };

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
        {loading
          ? // Show skeleton loaders while loading
            Array(6)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="relative bg-white shadow-lg rounded-2xl overflow-hidden w-full transition-all duration-300"
                >
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
          : // Show actual pet data when loading is complete
            petData.map((pet) => (
                <Link href={`/pet-detail/${pet.id}`} key={pet.id} passHref>
                <Card
                  className="relative bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 w-full group cursor-pointer"
                >
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
                        src={pet.image}
                        alt={pet.name}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-5">
                      <CardTitle className="text-lg sm:text-xl font-bold">
                        {pet.name}
                      </CardTitle>
                      
                      <div className="flex flex-wrap text-sm text-gray-500 mt-2 mb-3">
                        <div className="flex items-center mr-4 mb-2">
                          <MapPin size={14} className="mr-1 text-[#4eb7f0]" />
                          <span>{pet.location}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Calendar size={14} className="mr-1 text-[#4eb7f0]" />
                          <span>{pet.date}</span>
                        </div>
                      </div>
                      
                      <CardDescription className="text-sm line-clamp-2 mb-5">
                        {pet.description}
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
            ))}
      </div>
    </section>
  );
}