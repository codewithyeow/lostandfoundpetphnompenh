import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const petData = [
  {
    id: 1,
    name: "Fluffy",
    description:
      "Fluffy is a friendly dog who loves playing in the park. He went missing near the city center.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Lost",
  },
  {
    id: 2,
    name: "Bella",
    description:
      "Bella is a calm and gentle cat. She has been lost since last Wednesday.",
    image: "/assets/petCarousel2.jpg",
    badgeType: "Lost",
  },
  {
    id: 3,
    name: "Max",
    description:
      "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Found",
  },
  {
    id: 4,
    name: "Max",
    description:
      "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Found",
  },
];

export default function Section2() {
  return (
    <section className="w-full bg-[#E4EAEE] px-4 md:px-8 lg:px-12 py-6">
      <h2 className="font-bold text-center mb-8 text-xl">LATEST UPDATED</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {petData.map((pet) => (
          <Card
            key={pet.id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
          >
            <Badge
              variant="default"
              className={`absolute top-3 right-3 text-white text-sm px-3 py-1 rounded-full shadow-md ${
                pet.badgeType === "Lost" ? "bg-red-500" : "bg-[#8DC63F]"
              }`}
            >
              {pet.badgeType}
            </Badge>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {pet.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-48">
                <Image
                  src={pet.image}
                  alt={pet.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <CardDescription className="mt-4 text-sm">
                {pet.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="px-4 pb-4 flex justify-between items-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Contact Owner
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
