import React from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "@component/ui/button";
import Image from "next/image";
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
} from "lucide-react";
import { fetchAllReport, fetchMyFavorite, fetchMyPet } from "@server/actions/animal-action";

export const dynamic = "force-dynamic";

interface PetReport {
  id:number;
  report_id: string;
  name: string;
  description: string;
  image: string;
  badgeType: "Lost" | "Found";
  finder_name: string;
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
  date_found?: string;
  where_pet_was_found?: string;
  condition?: string;
  additional_details?: string;
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

const conditionMap: { [key: string]: string } = {
  "1": "Healthy",
  "2": "Injured",
  "3": "Unknown",
};

async function getPetData(reportId: string): Promise<PetReport | null> {
  try {
    const [myPetsResponse, allReportsResponse, favoritesResponse] = await Promise.all([
      fetchMyPet(),
      fetchAllReport(),
      fetchMyFavorite(),
    ]);

    const normalizePet = (pet: any, index: number): PetReport => {
      const petId = pet.id?.toString() || pet.report_id || pet.pivot?.model_id?.toString();
      const reportType =
        pet.report_type?.toString() ||
        (pet.image?.includes("lost") ? "1" : pet.image?.includes("found") ? "2" : "1");
      const badgeType = reportType === "1" ? "Lost" : "Found";

      return {
        id: pet.id ? Number(pet.id) : pet.report_id ? Number(pet.report_id) : index + 1,
        report_id: petId || `temp-${index}`,
        name: pet.name_en || "Unnamed Pet",
        description: pet.desc || "No description provided",
        image: pet.image
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage${pet.image.startsWith("/") ? pet.image : `/${pet.image}`}`
          : "/assets/default-pet.jpg",
        badgeType: badgeType,
        finder_name: pet.finder_name || pet.owner_name || "Unknown", // Adjust based on API response
        report_type: reportType,
        location: pet.location || "",
        date: pet.report_date
          ? new Date(pet.report_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        status: (pet.animal_status === 1 || pet.status === 1) ? "Active" : "Reunited",
        reward: pet.reward || undefined,
        breed_id: pet.breed_id?.toString() || "",
        species: pet.species?.toString() || "",
        sex: pet.sex?.toString() || "",
        size: pet.size?.toString() || "",
        distinguishing_features: pet.distinguishing_features || "",
        date_found: pet.date_found || "",
        where_pet_was_found: pet.where_pet_was_found || pet.nearest_address_last_seen || "",
        condition: pet.condition?.toString() || "",
        additional_details: pet.additional_details || "",
        contact_email: pet.contact_email || "",
        phone_number: pet.phone_number || "",
      };
    };

    const myPets = myPetsResponse.success
      ? (myPetsResponse.result ?? []).map(normalizePet)
      : [];
    const allReports = allReportsResponse.success
      ? (allReportsResponse.result ?? []).map(normalizePet)
      : [];
    const favorites = favoritesResponse.success
      ? (favoritesResponse.result ?? []).map(normalizePet)
      : [];
    const combinedPets = [...myPets, ...allReports, ...favorites].reduce(
      (unique: PetReport[], pet: PetReport) =>
        unique.some((p) => p.report_id === pet.report_id) ? unique : [...unique, pet],
      [] as PetReport[]
    );

    console.log("Combined Pets:", combinedPets.map(p => ({ report_id: p.report_id, report_type: p.report_type })));
    const pet = combinedPets.find((p) => p.report_id === reportId && p.report_type === "2");
    console.log("Found Pet:", pet);

    if (!pet) return null;
    return pet;
  } catch (error) {
    console.error("Error fetching found pet data:", error);
    return null;
  }
}


export default async function PetDetailFoundPage({ params,searchParams }: PageProps) {
  const pet = await getPetData(params.id);
  if (!pet) return notFound();
  const from = searchParams.from as string | undefined;
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
              className="absolute top-4 left-4 z-10 text-white text-xs md:text-sm font-medium px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-md bg-[#8DC63F]"
            >
              Found
            </Badge>
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
                      {pet.date_found || pet.date}
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
                      Found At
                    </p>
                    <p className="text-sm md:text-base break-words">
                      {pet.where_pet_was_found || pet.location || "Unknown"}
                    </p>
                  </div>
                </div>
                {pet.condition && (
                  <div className="flex items-start">
                    <Info
                      size={16}
                      className="mr-2 text-green-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Condition
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {conditionMap[pet.condition] || "Unknown"}
                      </p>
                    </div>
                  </div>
                )}
                {pet.additional_details && (
                  <div className="flex items-start">
                    <Info
                      size={16}
                      className="mr-2 text-green-600 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        Additional Details
                      </p>
                      <p className="text-sm md:text-base break-words">
                        {pet.additional_details}
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
                          Found By
                        </p>
                        <p className="font-medium text-sm md:text-base break-words">
                          {pet.finder_name}
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
                  Call Finder
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
