import React from "react"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Sample pet data for demonstration
const petData = [
  {
    id: 1,
    name: "Fluffy",
    description: "Fluffy is a friendly dog who loves playing in the park. He went missing near the city center.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Lost",
  },
  {
    id: 2,
    name: "Bella",
    description: "Bella is a calm and gentle cat. She has been lost since last Wednesday.",
    image: "/assets/petCarousel2.jpg",
    badgeType: "Lost",
  },
  {
    id: 3,
    name: "Max",
    description: "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Found",
  },
  {
    id: 4,
    name: "Max",
    description: "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Found",
  },
  {
    id: 5,
    name: "Max",
    description: "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Found",
  },
  {
    id: 6,
    name: "Max",
    description: "Max is an energetic puppy, and he was last seen in the downtown area.",
    image: "/assets/petCarousel.jpg",
    badgeType: "Found",
  },
  
];

export default function Section2() {
  return (
    <section className="w-full p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="font-bold text-center mb-8 text-2xl text-black">Last Updated</h2>

        {/* Grid layout with 3 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-12">
          {petData.map((pet) => (
            <Card key={pet.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-80 mx-auto">
              {/* Custom Badge with different styles for Lost and Found */}
              <Badge
                variant="default"
                className={`absolute top-3 right-3 text-white text-sm px-3 py-1 rounded-full shadow-md ${pet.badgeType === "Lost" ? "bg-red-500" : "bg-[#8DC63F]"}`}
              >
                {pet.badgeType}
              </Badge>

              <CardHeader className="px-4 pt-4">
                <CardTitle className="text-lg font-semibold text-gray-800">{pet.name}</CardTitle>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <CardDescription className="mt-4 text-sm text-gray-600">{pet.description}</CardDescription>
              </CardContent>

              <CardFooter className="px-4 pb-4 flex justify-between items-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Contact Owner
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
