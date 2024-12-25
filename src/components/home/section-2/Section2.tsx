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
];


export default function Section2() {
  return (
    <section className="w-full bg-white p-6">
      <h2 className="font-bold text-center mb-8 text-2xl ">Lasted Updated</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {petData.map((pet) => (
          
          <Card key={pet.id} className="w-full">
               <Badge variant={pet.badgeType === "Lost" ? "destructive" : "secondary"} className="badge-neutral rounded-full badge-xl,"> 
                {pet.badgeType}
              </Badge>
            <CardHeader>
              <CardTitle>{pet.name}</CardTitle>
           
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
              <CardDescription className="mt-4">{pet.description}</CardDescription>
            </CardContent>

            <CardFooter>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Contact Owner
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
