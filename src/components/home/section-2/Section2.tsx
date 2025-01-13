import React from "react";
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
    id: 5,
    name: "Ching Chang",
    description:
      "Whiskers is a stray cat. She has been roaming around the neighborhood.",
    image: "/assets/image4.jpg",
    badgeType: "Stray",
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
              <CardTitle className="text-lg font-semibold">
                {pet.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-72">
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
