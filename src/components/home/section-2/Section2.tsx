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

const petData = [
  {
    id: 1,
    name: "Fluffy",
    description:
      "Fluffy is a friendly dog who loves playing in the park. He went missing near the city center.",
    image: "/assets/image.jpg",
    badgeType: "Lost",
  },
  {
    id: 2,
    name: "Bella",
    description:
      "Bella is a calm and gentle cat. She has been lost since last Wednesday.",
    image: "/assets/image1.jpg",
    badgeType: "Lost",
  },
  {
    id: 3,
    name: "Max",
    description:
      "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/image2.jpg",
    badgeType: "Found",
  },
  {
    id: 4,
    name: "Buddy",
    description:
      "Buddy was found wandering around the street. Looking for his owner.",
    image: "/assets/image3.jpg",
    badgeType: "Found",
  },
  {
    id: 5,
    name: "Whiskers",
    description:
      "Whiskers is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image5.jpg",
    badgeType: "Stray",
  },
  {
    id: 6,
    name: "Ching Chang",
    description:
      "Ching Chang is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image4.jpg",
    badgeType: "Stray",
  },
];

export default function Section2() {
  const [loading, setLoading] = useState(true);

  // Simulate data loading delay
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout); // Clear timeout when component unmounts
  }, []);

  return (
    <section className="w-full bg-[#E4EAEE] px-4 md:px-8 lg:px-12 py-6">
      <h2 className="font-bold text-center mb-8 text-xl">LATEST UPDATED</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {loading
          ? // Show skeleton loaders while loading
            Array(6)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="relative bg-white shadow-lg rounded-lg overflow-hidden w-full p-2 sm:p-4 lg:p-4"
                >
                  <Skeleton className="absolute top-3 right-3 w-[80px] h-[30px] rounded-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-[50%] rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="w-full h-52 sm:h-60 lg:h-72 rounded-lg" />
                    <Skeleton className="mt-2 h-4 w-full rounded-md" />
                    <Skeleton className="mt-2 h-4 w-[80%] rounded-md" />
                  </CardContent>
                  <CardFooter className="px-4 pb-4 flex justify-between items-center">
                    <Skeleton className="h-8 w-[100px] rounded-lg" />
                  </CardFooter>
                </Card>
              ))
          : // Show actual pet data when loading is complete
            petData.map((pet) => (
              <Card
                key={pet.id}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full p-2 sm:p-4 lg:p-4"
              >
                <Badge
                  variant="default"
                  className={`absolute top-3 right-3 text-white text-sm px-3 py-1 rounded-full shadow-md ${
                    pet.badgeType === "Lost"
                      ? "bg-red-500"
                      : pet.badgeType === "Found"
                      ? "bg-[#8DC63F]"
                      : "bg-yellow-500"
                  }`}
                >
                  {pet.badgeType}
                </Badge>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-md lg:text-lg font-semibold">
                    {pet.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-52 sm:h-60 lg:h-72">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <CardDescription className="mt-2 text-xs sm:text-sm lg:text-sm">
                    {pet.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="px-4 pb-4 flex justify-between items-center">
                  <button className="bg-blue-500 text-white text-xs sm:text-sm lg:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    Contact Owner
                  </button>
                </CardFooter>
              </Card>
            ))}
      </div>
    </section>
  );
}
