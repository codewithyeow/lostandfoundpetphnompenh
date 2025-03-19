"use client";
import React from "react";
import Image from "next/image";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import Link from "next/link";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MessageCircle,
  Share2,
  User
} from "lucide-react";
import { petData } from "@component/home/section-2/Section2";
import { notFound } from "next/navigation";

// This is a dynamically rendered page
export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PetDetailPage({ params }: PageProps) {
  const petId = parseInt(params.id);
  
  // Find the pet with the matching ID
  const pet = petData.find(p => p.id === petId);
  
  if (!pet) {
    return notFound();
  }
  
  // Extended pet information (in a real app, you would fetch this from your API)
  const petDetails = {
    ...pet,
    breed: pet.name === "Fluffy" ? "Golden Retriever" : 
           pet.name === "Bella" ? "Siamese Cat" : 
           pet.name === "Max" ? "Labrador Puppy" : 
           pet.name === "Buddy" ? "Beagle" : 
           pet.name === "Whiskers" ? "Tabby Cat" : "Mixed Breed",
    age: pet.name === "Fluffy" ? "3 years" : 
         pet.name === "Bella" ? "5 years" : 
         pet.name === "Max" ? "6 months" : 
         pet.name === "Buddy" ? "2 years" : 
         pet.name === "Whiskers" ? "Unknown" : "1 year",
    gender: ["Fluffy", "Max", "Buddy"].includes(pet.name) ? "Male" : "Female",
    color: pet.name === "Fluffy" ? "Golden" : 
           pet.name === "Bella" ? "Brown and Cream" : 
           pet.name === "Max" ? "Black" : 
           pet.name === "Buddy" ? "Brown and White" : 
           pet.name === "Whiskers" ? "Gray Tabby" : "Mixed",
    contactName: "John Doe",
    contactPhone: "+1 (555) 123-4567",
    contactEmail: "contact@petfinder.example",
    additionalImages: ["/assets/additional1.jpg", "/assets/additional2.jpg"],
    lastSeenDetails: pet.badgeType === "Lost" ? 
      "Last seen near the park entrance. Was wearing a blue collar with name tag." : 
      pet.badgeType === "Found" ? 
      "Found wandering near the shopping center. Appears to be well taken care of." : 
      "Has been in the area for approximately two weeks.",
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] min-h-screen px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/"
          className="flex items-center text-[#4eb7f0] mb-8 hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Listings
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <div className="w-full h-60 md:h-96 relative">
              <Image
                src={pet.image}
                alt={pet.name}
                fill
                priority
                style={{ objectFit: "cover" }}
              />
            </div>
            
            <Badge
              variant="default"
              className={`absolute top-4 left-4 z-10 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-md ${
                pet.badgeType === "Lost"
                  ? "bg-red-500"
                  : pet.badgeType === "Found"
                  ? "bg-[#8DC63F]"
                  : "bg-yellow-500"
              }`}
            >
              {pet.badgeType}
            </Badge>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{pet.name}</h1>
                <div className="flex flex-wrap text-sm text-gray-500 mb-4">
                  <div className="flex items-center mr-4 mb-2">
                    <MapPin size={16} className="mr-1 text-[#4eb7f0]" />
                    <span>{pet.location}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Calendar size={16} className="mr-1 text-[#4eb7f0]" />
                    <span>{pet.date}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-gray-600 mb-6">{pet.description}</p>
                
                <p className="text-gray-600 font-semibold">
                  {petDetails.lastSeenDetails}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Breed</p>
                  <p className="font-semibold">{petDetails.breed}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Age</p>
                  <p className="font-semibold">{petDetails.age}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Gender</p>
                  <p className="font-semibold">{petDetails.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Color</p>
                  <p className="font-semibold">{petDetails.color}</p>
                </div>
              </div>
            </div>
            
            {petDetails.additionalImages && petDetails.additionalImages.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">Photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={pet.image}
                      alt={`${pet.name} main photo`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {petDetails.additionalImages.map((img, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`${pet.name} photo ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <h2 className="text-xl font-bold mb-4" id="contact">Contact Information</h2>
            <Card className="bg-gray-50 border-0 rounded-xl mb-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User size={18} className="text-[#4eb7f0] mr-2" />
                  <span className="font-medium">{petDetails.contactName}</span>
                </div>
                <div className="flex items-center mb-4">
                  <Phone size={18} className="text-[#4eb7f0] mr-2" />
                  <span>{petDetails.contactPhone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="text-[#4eb7f0] mr-2" />
                  <span>{petDetails.contactEmail}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-4">
              <Button className="bg-[#4eb7f0] hover:bg-[#3a9fd8] text-white py-6 rounded-full">
                <Phone size={18} className="mr-2" />
                Call Owner
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button variant="ghost" className="text-gray-500">
                <Share2 size={18} className="mr-2" />
                Share This Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
