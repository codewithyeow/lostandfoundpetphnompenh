"use client";
import React, { useState } from "react";
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
  User,
  Tag,
  Info,
  AlertCircle,
  Clock,
  DollarSign,
  Map,
  Home,
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
  const [showMap, setShowMap] = useState(false);

  // Find the pet with the matching ID
  const pet = petData.find((p) => p.id === petId);

  if (!pet) {
    return notFound();
  }

  // Extended pet information (in a real app, you would fetch this from your API)
  const petDetails = {
    ...pet,
    species: pet.petType === "Dog" ? "Dog" : "Cat",
    breed:
      pet.name === "Fluffy"
        ? "Golden Retriever"
        : pet.name === "Bella"
        ? "Siamese Cat"
        : pet.name === "Max"
        ? "Labrador Puppy"
        : pet.name === "Buddy"
        ? "Beagle"
        : pet.name === "Whiskers"
        ? "Tabby Cat"
        : "Mixed Breed",
    age:
      pet.name === "Fluffy"
        ? "3 years"
        : pet.name === "Bella"
        ? "5 years"
        : pet.name === "Max"
        ? "6 months"
        : pet.name === "Buddy"
        ? "2 years"
        : pet.name === "Whiskers"
        ? "Unknown"
        : "1 year",
    gender: ["Fluffy", "Max", "Buddy"].includes(pet.name) ? "Male" : "Female",
    color:
      pet.name === "Fluffy"
        ? "Golden"
        : pet.name === "Bella"
        ? "Brown and Cream"
        : pet.name === "Max"
        ? "Black"
        : pet.name === "Buddy"
        ? "Brown and White"
        : pet.name === "Whiskers"
        ? "Gray Tabby"
        : "Mixed",
    size:
      pet.name === "Fluffy"
        ? "Large"
        : pet.name === "Bella"
        ? "Medium"
        : pet.name === "Max"
        ? "Small"
        : pet.name === "Buddy"
        ? "Medium"
        : pet.name === "Whiskers"
        ? "Small"
        : "Medium",
    microchipped: ["Fluffy", "Buddy"].includes(pet.name),
    collarInfo:
      pet.name === "Fluffy"
        ? "Blue collar with name tag"
        : pet.name === "Buddy"
        ? "Red collar with bone tag"
        : "No collar",
    distinctiveFeatures:
      pet.name === "Fluffy"
        ? "Small scar on left ear"
        : pet.name === "Bella"
        ? "White spot on chest"
        : pet.name === "Max"
        ? "White paws"
        : pet.name === "Buddy"
        ? "One brown eye, one blue eye"
        : pet.name === "Whiskers"
        ? "Torn right ear"
        : "None",
    ownerName:
      pet.name === "Fluffy"
        ? "John Smith"
        : pet.name === "Max"
        ? "Sarah Johnson"
        : pet.name === "Buddy"
        ? "Michael Brown"
        : "Jane Doe",
    contactEmail:
      pet.name === "Fluffy"
        ? "john.smith@example.com"
        : pet.name === "Max"
        ? "sarah.j@example.com"
        : pet.name === "Buddy"
        ? "mbrown@example.com"
        : "contact@petfinder.example",
    contactPhone:
      pet.name === "Fluffy"
        ? "+1 (555) 123-4567"
        : pet.name === "Max"
        ? "+1 (555) 987-6543"
        : pet.name === "Buddy"
        ? "+1 (555) 456-7890"
        : "+1 (555) 111-2222",
    additionalImages: ["/assets/additional1.jpg", "/assets/additional2.jpg"],
    dateLost: pet.date,
    dateFound: pet.date,
    dateReported: pet.date,
    locationLost:
      pet.badgeType === "Lost"
        ? "Downtown Central Park, near the fountain"
        : "Near Washington Square Park",
    locationFound:
      pet.badgeType === "Found"
        ? "Near Washington Square Park"
        : "Not applicable",
    locationSpotted:
      pet.badgeType === "Stray"
        ? "Frequently seen around Jefferson Street and 5th Avenue"
        : "Not applicable",
    geoLocation:
      pet.badgeType === "Lost"
        ? { lat: 40.7812, lng: -73.9665 }
        : pet.badgeType === "Found"
        ? { lat: 40.7308, lng: -73.9973 }
        : { lat: 40.7352, lng: -73.9922 },
    lastSeenDetails:
      pet.badgeType === "Lost"
        ? "Last seen near the park entrance. Was wearing a blue collar with name tag."
        : "",
    foundDetails:
      pet.badgeType === "Found"
        ? "Found wandering alone near the park. Friendly and approached when called."
        : "",
    strayDetails:
      pet.badgeType === "Stray"
        ? "Has been spotted in the area multiple times over the past week. Appears to be friendly but cautious."
        : "",
    scheduleDetails:
      pet.badgeType === "Stray"
        ? "Usually spotted in early morning (6-8am) and evening (5-7pm)."
        : "",
    feedingStation:
      pet.badgeType === "Stray"
        ? "Local residents have set up a feeding station at the corner of Jefferson and 5th."
        : "",
    reward:
      pet.badgeType === "Lost"
        ? pet.name === "Fluffy"
          ? "$100 "
          : pet.name === "Max"
          ? "$50 "
          : pet.name === "Buddy"
          ? "$200"
          : ""
        : "",
    shelterInfo:
      pet.badgeType === "Stray"
        ? "Local animal control has been notified. Case #ST-2025-0342."
        : "",
    reportedBy: pet.badgeType === "Stray" ? "Community Watch Group" : "",
    contactInfoForStray:
      pet.badgeType === "Stray"
        ? {
            name: "Community Animal Watch",
            phone: "+1 (555) 789-0123",
            email: "watch@community-animals.org",
          }
        : null,
    subscribedToAlerts: pet.badgeType === "Lost" ? true : false,
  };

  // Determine the type of pet listing
  const isLostPet = pet.badgeType === "Lost";
  const isFoundPet = pet.badgeType === "Found";
  const isStrayPet = pet.badgeType === "Stray";

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap);
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
            <div className="w-full h-48 md:h-64 lg:h-96 relative">
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
              className={`absolute top-4 left-4 z-10 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-md ${
                isLostPet
                  ? "bg-red-500"
                  : isFoundPet
                  ? "bg-[#8DC63F]"
                  : "bg-amber-500"
              }`}
            >
              {pet.badgeType}
            </Badge>

            {isLostPet && petDetails.reward && (
  <Badge
    variant="outline"
    className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 animate-bounce motion-safe:animate-pulse"
  >
    <span className="inline-block animate-pulse">💰</span> REWARD: {petDetails.reward}
  </Badge>
)}
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-6">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                  {isStrayPet ? pet.name || "Unnamed Stray" : pet.name}
                </h1>
                <div className="flex flex-wrap text-sm text-gray-500 mb-2">
                  <div className="flex items-center mr-4 mb-2">
                    <Tag size={16} className="mr-1 text-[#4eb7f0]" />
                    <span>{petDetails.species}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lost Pet Information Section - Mobile Optimized */}
            {isLostPet && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-bold text-red-700 mb-2 flex items-center">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                  Lost Pet Information
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <Calendar
                      size={16}
                      className="mr-2 text-red-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Date Lost
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {petDetails.dateLost}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin
                      size={16}
                      className="mr-2 text-red-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Location
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {petDetails.locationLost}
                      </p>
                      <Button
                        variant="link"
                        className="text-red-600 hover:text-red-800 p-0 h-auto mt-1 text-sm"
                        onClick={toggleMap}
                      >
                        <Map size={14} className="mr-1" />
                        {showMap ? "Hide map" : "Show on map"}
                      </Button>
                    </div>
                  </div>

                  {showMap && (
                    <div className="w-full h-48 md:h-64 bg-gray-100 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 p-2 md:p-4 flex items-center justify-center">
                        <div className="w-full h-full relative rounded-lg overflow-hidden">
                          <Image
                            src="/api/placeholder/600/300"
                            alt="Map location"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className="absolute"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -100%)",
                            }}
                          >
                            <MapPin size={28} className="text-red-600" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-white py-1 px-2 rounded-md text-xs md:text-sm shadow-md">
                            Lat: {petDetails.geoLocation.lat.toFixed(4)}, Lng:{" "}
                            {petDetails.geoLocation.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {petDetails.lastSeenDetails && (
                    <div className="flex items-start">
                      <Info
                        size={16}
                        className="mr-2 text-red-600 mt-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-700 text-sm md:text-base">
                          Last Seen
                        </p>
                        <p className="text-sm md:text-base break-words">
                          {petDetails.lastSeenDetails}
                        </p>
                      </div>
                    </div>
                  )}

                  {petDetails.reward && (
                    <div className="flex items-start">
                      <DollarSign
                        size={16}
                        className="mr-2 text-red-600 mt-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-700 text-sm md:text-base">
                          Reward
                        </p>
                        <p className="text-sm md:text-base break-words">
                          {petDetails.reward}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Found Pet Information Section - Mobile Optimized */}
            {isFoundPet && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-bold text-green-700 mb-2 flex items-center">
                  <Info size={18} className="mr-2 flex-shrink-0" />
                  Found Pet Information
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <Calendar
                      size={16}
                      className="mr-2 text-green-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Date Found
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {petDetails.dateFound}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin
                      size={16}
                      className="mr-2 text-green-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Location Found
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {petDetails.locationFound}
                      </p>
                      <Button
                        variant="link"
                        className="text-green-600 hover:text-green-800 p-0 h-auto mt-1 text-sm"
                        onClick={toggleMap}
                      >
                        <Map size={14} className="mr-1" />
                        {showMap ? "Hide map" : "Show on map"}
                      </Button>
                    </div>
                  </div>

                  {showMap && (
                    <div className="w-full h-48 md:h-64 bg-gray-100 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 p-2 md:p-4 flex items-center justify-center">
                        <div className="w-full h-full relative rounded-lg overflow-hidden">
                          <Image
                            src="/api/placeholder/600/300"
                            alt="Map location"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className="absolute"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -100%)",
                            }}
                          >
                            <MapPin size={28} className="text-green-600" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-white py-1 px-2 rounded-md text-xs md:text-sm shadow-md">
                            Lat: {petDetails.geoLocation.lat.toFixed(4)}, Lng:{" "}
                            {petDetails.geoLocation.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {petDetails.foundDetails && (
                    <div className="flex items-start">
                      <Info
                        size={16}
                        className="mr-2 text-green-600 mt-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-700 text-sm md:text-base">
                          Details
                        </p>
                        <p className="text-sm md:text-base break-words">
                          {petDetails.foundDetails}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stray Pet Information Section - Mobile Optimized */}
            {isStrayPet && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <h2 className="text-base md:text-lg font-bold text-amber-700 mb-2 flex items-center">
                  <Info size={18} className="mr-2 flex-shrink-0" />
                  Stray Pet Information
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <Calendar
                      size={16}
                      className="mr-2 text-amber-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Date Reported
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {petDetails.dateReported}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin
                      size={16}
                      className="mr-2 text-amber-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Location Spotted
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {petDetails.locationSpotted}
                      </p>
                      <Button
                        variant="link"
                        className="text-amber-600 hover:text-amber-800 p-0 h-auto mt-1 text-sm"
                        onClick={toggleMap}
                      >
                        <Map size={14} className="mr-1" />
                        {showMap ? "Hide map" : "Show on map"}
                      </Button>
                    </div>
                  </div>

                  {showMap && (
                    <div className="w-full h-48 md:h-64 bg-gray-100 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 p-2 md:p-4 flex items-center justify-center">
                        <div className="w-full h-full relative rounded-lg overflow-hidden">
                          <Image
                            src="/api/placeholder/600/300"
                            alt="Map location"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className="absolute"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -100%)",
                            }}
                          >
                            <MapPin size={28} className="text-amber-600" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-white py-1 px-2 rounded-md text-xs md:text-sm shadow-md">
                            Lat: {petDetails.geoLocation.lat.toFixed(4)}, Lng:{" "}
                            {petDetails.geoLocation.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {petDetails.strayDetails && (
                    <div className="flex items-start">
                      <Info
                        size={16}
                        className="mr-2 text-amber-600 mt-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-700 text-sm md:text-base">
                          Details
                        </p>
                        <p className="text-sm md:text-base break-words">
                          {petDetails.strayDetails}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pet details and contact information - Mobile Optimized */}
            <div className="space-y-6">
              {/* Pet Details Section */}
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-3">
                  Pet Details
                </h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm md:text-base">
                  {(pet.name || isStrayPet) && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Name</p>
                      <p className="font-semibold">
                        {pet.name || (isStrayPet ? "Unknown/Unnamed" : "")}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-500 text-xs md:text-sm">Species</p>
                    <p className="font-semibold">{petDetails.species}</p>
                  </div>

                  {petDetails.breed && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Breed</p>
                      <p className="font-semibold">{petDetails.breed}</p>
                    </div>
                  )}

                  {petDetails.color && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Color</p>
                      <p className="font-semibold">{petDetails.color}</p>
                    </div>
                  )}

                  {petDetails.age && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Age</p>
                      <p className="font-semibold">{petDetails.age}</p>
                    </div>
                  )}

                  {petDetails.gender && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Gender</p>
                      <p className="font-semibold">{petDetails.gender}</p>
                    </div>
                  )}

                  {petDetails.size && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Size</p>
                      <p className="font-semibold">{petDetails.size}</p>
                    </div>
                  )}

                  {petDetails.distinctiveFeatures && (
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs md:text-sm">
                        Distinctive Features
                      </p>
                      <p className="font-semibold break-words">
                        {petDetails.distinctiveFeatures}
                      </p>
                    </div>
                  )}

                  {petDetails.collarInfo &&
                    petDetails.collarInfo !== "No collar" && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs md:text-sm">
                          Collar
                        </p>
                        <p className="font-semibold break-words">
                          {petDetails.collarInfo}
                        </p>
                      </div>
                    )}
                </div>

                {petDetails.description && (
                  <div className="mt-4">
                    <h2 className="text-lg md:text-xl font-bold mb-2">
                      Description
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      {pet.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information Section */}
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-3" id="contact">
                  Contact Information
                </h2>
                <Card className="bg-gray-50 border-0 rounded-xl mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <User
                        size={16}
                        className="text-[#4eb7f0] mr-2 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs md:text-sm">
                          {isFoundPet
                            ? "Found by"
                            : isStrayPet
                            ? "Reported by"
                            : "Owner Name"}
                        </p>
                        <p className="font-medium text-sm md:text-base break-words">
                          {isStrayPet
                            ? petDetails.reportedBy
                            : petDetails.ownerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <Phone
                        size={16}
                        className="text-[#4eb7f0] mr-2 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs md:text-sm">
                          Phone Number
                        </p>
                        <p className="font-medium text-sm md:text-base break-words">
                          {isStrayPet && petDetails.contactInfoForStray
                            ? petDetails.contactInfoForStray.phone
                            : petDetails.contactPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail
                        size={16}
                        className="text-[#4eb7f0] mr-2 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-gray-500 text-xs md:text-sm">
                          Contact Email
                        </p>
                        <p className="font-medium text-sm md:text-base break-words">
                          {isStrayPet && petDetails.contactInfoForStray
                            ? petDetails.contactInfoForStray.email
                            : petDetails.contactEmail}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call Owner Button */}
                <Button className="w-full bg-[#4eb7f0] hover:bg-[#3a9fd8] text-white py-2 h-auto rounded-full mb-4">
                  <Phone size={16} className="mr-2" />
                  {isFoundPet
                    ? "Call Finder"
                    : isStrayPet
                    ? "Call Reporter"
                    : "Call Owner"}
                </Button>

                {/* Additional Images */}
                {petDetails.additionalImages &&
                  petDetails.additionalImages.length > 0 && (
                    <div className="mt-4">
                      <h2 className="text-lg md:text-xl font-bold mb-3">
                        Photos
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {petDetails.additionalImages.map((img, index) => (
                          <div
                            key={index}
                            className="aspect-square relative rounded-lg overflow-hidden"
                          >
                            <Image
                              src={img}
                              alt={`${pet.name || "Pet"} photo ${index + 1}`}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Share Button - Now positioned close to the Call Owner button */}
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
    </div>
  );
}
