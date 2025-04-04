import React from "react";
import Image from "next/image";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "@component/ui/button";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Phone,
  Mail,
  User,
  Tag,
  Info,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { fetchAllReport, fetchMyFavorite, fetchMyPet } from "@server/actions/animal-action";

export const dynamic = "force-dynamic";

interface PetReport {
  report_id: string;
  name: string;
  description: string;
  image: string;
  badgeType: "Lost" | "Found";
  report_type: string;
  location: string;
  date: string;
  status: "Active" | "Reunited";
  reward?: string;
  breed_id: string;
  species: string;
  sex: string;
  size: string;
  distinguishing_features: string;
  date_lost?: string;
  nearest_address_last_seen?: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
}

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined }; // App Router provides searchParams
}

const speciesMap: { [key: string]: string } = {
  "1": "Dog",
  "2": "Cat",
  "3": "Bird",
};

const sexMap: { [key: string]: string } = {
  "1": "Male",
  "2": "Female",
  "3": "Unknown",
};

const sizeMap: { [key: string]: string } = {
  "1": "Small",
  "2": "Medium",
  "3": "Large",
};

async function getPetData(id: string, from: string | undefined): Promise<PetReport | null> {
  try {
    const [myPetsResponse, allReportsResponse, favoritesResponse] = await Promise.all([
      fetchMyPet(),
      fetchAllReport(),
      from === "dashboard" ? fetchMyFavorite() : Promise.resolve({ success: false, result: [] }),
    ]);

    const myPets = myPetsResponse.success ? myPetsResponse.result ?? [] : [];
    const allReports = allReportsResponse.success ? allReportsResponse.result ?? [] : [];
    const favorites = favoritesResponse.success ? favoritesResponse.result ?? [] : [];

    let pet;

    console.log("Searching for pet with ID:", id, "From:", from);
    console.log("Favorites:", favorites);
    console.log("My Pets:", myPets);
    console.log("All Reports:", allReports);

    if (from === "dashboard") {
      // Step 1: Find the pet in the favorites response using animal_id (id or pivot.model_id)
      pet = favorites.find((p: any) => p.id.toString() === id || p.pivot?.model_id.toString() === id);

      console.log("Found pet in favorites:", pet);

      if (!pet) {
        // Step 2: If not found in favorites, search in myPets and allReports using animal_id
        pet = [...myPets, ...allReports].find((p: any) => p.animal_id?.toString() === id || p.id?.toString() === id);
      }

      console.log("Found pet after searching myPets/allReports:", pet);

      if (!pet) return null;

      // Step 3: Find the full report data using the animal_id
      const report = [...myPets, ...allReports].find(
        (r: any) => r.animal_id?.toString() === pet.id.toString() || r.id?.toString() === pet.id.toString()
      );

      console.log("Found report:", report);

      if (!report) return null;

      pet = report; // Use the full report data
    } else {
      // If not coming from dashboard, treat params.id as report_id
      pet = [...myPets, ...allReports].find(
        (p: any) => p.report_id.toString() === id && p.report_type.toString() === "1"
      );

      console.log("Found pet by report_id (non-dashboard):", pet);

      if (!pet) return null;
    }

    const imagePath = pet.image?.startsWith("/") ? pet.image : `/${pet.image}`;
    const imageUrl = pet.image
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${imagePath}`
      : "/assets/default-pet.jpg";

    return {
      report_id: pet.report_id?.toString() || id,
      name: pet.name_en || "Unnamed Pet",
      description: pet.desc || "No description provided",
      image: imageUrl,
      badgeType: "Lost",
      report_type: pet.report_type?.toString() || "1",
      location: pet.location || pet.nearest_address_last_seen || pet.where_pet_was_found || "",
      date: pet.report_date
        ? new Date(pet.report_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      status: (pet.animal_status === 1 ? "Active" : "Reunited") as "Active" | "Reunited",
      reward: pet.reward || undefined,
      breed_id: pet.breed_id?.toString() || "",
      species: pet.species?.toString() || "",
      sex: pet.sex?.toString() || "",
      size: pet.size?.toString() || "",
      distinguishing_features: pet.distinguishing_features || "",
      date_lost: pet.date_lost || "",
      nearest_address_last_seen: pet.nearest_address_last_seen || "",
      owner_name: pet.owner_name || "Unknown",
      contact_email: pet.contact_email || "",
      phone_number: pet.phone_number || "",
    };
  } catch (error) {
    console.error("Error fetching lost pet data:", error);
    return null;
  }
}

export default async function PetDetailLostPage({
  params,
  searchParams,
}: PageProps) {
  const from = searchParams.from as string | undefined;
  const pet = await getPetData(params.id, from);
  if (!pet) return notFound();
  const backUrl = from === "dashboard" ? "/dashboard/profile" : "/";

  return (
    <div className="w-full bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] min-h-screen px-4 md:px-8 lg:px-12 py-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href={backUrl}
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
              className="absolute top-4 left-4 z-10 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-md bg-red-500"
            >
              Lost
            </Badge>
            {pet.reward && (
              <Badge
                variant="outline"
                className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-red-700 text-white border-red-600 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 animate-bounce motion-safe:animate-pulse"
              >
                <span className="inline-block animate-pulse">💰</span> REWARD:{" "}
                {pet.reward}
              </Badge>
            )}
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-6">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
                  {pet.name}
                </h1>
                <div className="flex flex-wrap text-sm text-gray-500 mb-2">
                  <div className="flex items-center mr-4 mb-2">
                    <Tag size={16} className="mr-1 text-[#4eb7f0]" />
                    <span>{speciesMap[pet.species] || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </div>

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
                      {pet.date_lost || pet.date}
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
                      Last Seen
                    </p>
                    <p className="text-sm md:text-base break-words">
                      {pet.nearest_address_last_seen ||
                        pet.location ||
                        "Unknown"}
                    </p>
                  </div>
                </div>
                {pet.distinguishing_features && (
                  <div className="flex items-start">
                    <Info
                      size={16}
                      className="mr-2 text-red-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Features
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {pet.distinguishing_features}
                      </p>
                    </div>
                  </div>
                )}
                {pet.reward && (
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
                        {pet.reward}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-3">
                  Pet Details
                </h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm md:text-base">
                  <div>
                    <p className="text-gray-500 text-xs md:text-sm">Name</p>
                    <p className="font-semibold">{pet.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs md:text-sm">Species</p>
                    <p className="font-semibold">
                      {speciesMap[pet.species] || "Unknown"}
                    </p>
                  </div>
                  {pet.breed_id && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Breed</p>
                      <p className="font-semibold">{pet.breed_id}</p>
                    </div>
                  )}
                  {pet.sex && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Sex</p>
                      <p className="font-semibold">
                        {sexMap[pet.sex] || "Unknown"}
                      </p>
                    </div>
                  )}
                  {pet.size && (
                    <div>
                      <p className="text-gray-500 text-xs md:text-sm">Size</p>
                      <p className="font-semibold">
                        {sizeMap[pet.size] || "Unknown"}
                      </p>
                    </div>
                  )}
                  {pet.distinguishing_features && (
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs md:text-sm">
                        Distinctive Features
                      </p>
                      <p className="font-semibold break-words">
                        {pet.distinguishing_features}
                      </p>
                    </div>
                  )}
                </div>
                {pet.description && (
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
                          Owner Name
                        </p>
                        <p className="font-medium text-sm md:text-base break-words">
                          {pet.owner_name}
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
                          {pet.phone_number || "Not provided"}
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
                          {pet.contact_email || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* <Button className="w-full bg-[#4eb7f0] hover:bg-[#3a9fd8] text-white py-2 h-auto rounded-full mb-4">
                  <Phone size={16} className="mr-2" />
                  Call Owner
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
