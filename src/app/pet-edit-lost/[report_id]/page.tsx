"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { editReportPet, EditReportPetParams } from "@server/actions/animal-action";
import { fetchMyPet } from "@server/actions/animal-action";
import {
  Dog,
  Cat,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  PenSquare,
  DollarSign,
  VenetianMask,
  Ruler,
  FileText,
  ArrowLeft,
  Save,
  Bird,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Mock function for fetching breeds
const fetchBreedsBySpecies = async (species: string) => {
  const breedMap: { [key: string]: { id: string; name: string }[] } = {
    "1": [
      { id: "1", name: "Labrador Retriever" },
      { id: "2", name: "German Shepherd" },
    ],
    "2": [
      { id: "3", name: "Persian" },
      { id: "4", name: "Siamese" },
    ],
    "3": [
      { id: "5", name: "Parrot" },
      { id: "6", name: "Canary" },
    ],
  };
  return breedMap[species] || [];
};

interface EditLostReportPageProps {
  params: { report_id: string };
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

const getSpeciesIcon = (species: string) => {
  switch (species) {
    case "1":
      return <Dog className="w-5 h-5" />;
    case "2":
      return <Cat className="w-5 h-5" />;
    case "3":
      return <Bird className="w-5 h-5" />;
    default:
      return <Dog className="w-5 h-5" />;
  }
};

const formatDateToMMDDYYYY = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const EditLostReportPage = ({ params }: EditLostReportPageProps) => {
  const router = useRouter();
  const { report_id } = params;
  const [petData, setPetData] = useState<EditReportPetParams | null>(null);
  const [breeds, setBreeds] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!report_id) return;

    const fetchPetData = async () => {
      try {
        const response = await fetchMyPet();
        console.log("Raw fetchMyPet response:", response);
        if (response.success && response.result) {
          const pet = Array.isArray(response.result)
            ? response.result.find((p) => p.report_id.toString() === report_id)
            : null;

          if (pet && pet.report_type?.toString() === "1") {
            const breedData = await fetchBreedsBySpecies(pet.species?.toString() || "1");
            const breed = breedData.find((b) => b.name === pet.breed_id?.toString() || b.id === pet.breed_id?.toString());
            const initialDate = pet.report_date || pet.date_lost;
            const mappedData: EditReportPetParams = {
              report_id: pet.report_id.toString(),
              report_type: "1", // Hardcoded for Lost
              animal_name: pet.name_en || "",
              breed_id: breed ? breed.id : pet.breed_id?.toString() || "",
              species: pet.species?.toString() || "1",
              sex: pet.sex?.toString() || "3", // Default to "Unknown"
              size: pet.size?.toString() || "",
              distinguishing_features: pet.distinguishing_features || pet.desc || "",
              date_lost: initialDate ? formatDateToMMDDYYYY(new Date(initialDate)) : "",
              nearest_address_last_seen: pet.nearest_address_last_seen || "",
              additional_location_details: pet.additional_details || pet.desc || "",
              owner_name: pet.owner_name || "Unknown",
              contact_email: pet.contact_email || "",
              phone_number: pet.phone_number || "",
              reward: pet.reward || "0",
            };
            console.log("Mapped petData (Lost):", mappedData);
            setPetData(mappedData);
            setSelectedDate(initialDate ? new Date(initialDate) : null);
            setBreeds(breedData);
          } else {
            throw new Error("Report is not a Lost report or not found");
          }
        }
      } catch (error) {
        console.error("Failed to fetch pet data:", error);
        toast.error("Failed to load pet data or report type mismatch. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [report_id]);

  useEffect(() => {
    if (!petData?.species) return;

    const updateBreeds = async () => {
      const breedData = await fetchBreedsBySpecies(petData.species);
      setBreeds(breedData);
      if (!breedData.some((breed) => breed.id === petData.breed_id)) {
        setPetData((prev) => (prev ? { ...prev, breed_id: "" } : null));
      }
    };

    updateBreeds();
  }, [petData?.species]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petData) return;

    if (!petData.breed_id) {
      toast.error("Please select a breed.");
      return;
    }

    if (!petData.sex) {
      toast.error("Please select a sex.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a lost date.");
      return;
    }

    if (!petData.nearest_address_last_seen) {
      toast.error("Please enter the last seen location.");
      return;
    }

    const updatedPetData: EditReportPetParams = {
      ...petData,
      date_lost: formatDateToMMDDYYYY(selectedDate),
      date_found: undefined, // Ensure Found fields are not sent
      where_pet_was_found: undefined,
      condition: undefined,
    };

    setIsSubmitting(true);
    try {
      const response = await editReportPet(updatedPetData);

      if (response.success) {
        toast.success("Lost pet report updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => router.push("/dashboard/profile"), 1000);
      } else {
        toast.error(`Failed to update report: ${response.message || "Unknown error"}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Failed to update report:", response.message, response.errors);
      }
    } catch (error) {
      toast.error("An error occurred while updating the report. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error updating report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPetData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#4eb7f0] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-700">Loading pet information...</p>
        </div>
      </div>
    );
  }

  if (!petData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lost Pet Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn’t find any lost pet with the provided ID.</p>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Lost Pet Report</h1>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center text-[#4eb7f0] hover:text-[#3a9cd3] transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
          <div className="p-3 bg-[#e6f4ff] rounded-full">
              {getSpeciesIcon(petData.species)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {petData.animal_name || "Unnamed Pet"}
              </h2>
              <p className="text-gray-600">Report Type: <span className="font-medium">Lost</span></p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pet Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <PenSquare className="w-4 h-4 text-[#4eb7f0]" />
                  Pet Name
                </label>
                <input
                  type="text"
                  name="animal_name"
                  value={petData.animal_name}
                  onChange={handleChange}
                  placeholder="Enter pet’s name"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-[#4eb7f0]" />
                  Breed
                </label>
                <select
                  name="breed_id"
                  value={petData.breed_id}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a breed</option>
                  {breeds.map((breed) => (
                    <option key={breed.id} value={breed.id}>
                      {breed.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  Currently: {breeds.find((b) => b.id === petData.breed_id)?.name || "Unknown"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Dog className="w-4 h-4 text-[#4eb7f0]" />
                  Species
                </label>
                <select
                  name="species"
                  value={petData.species}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                >
                  <option value="1">Dog</option>
                  <option value="2">Cat</option>
                  <option value="3">Bird</option>
                </select>
                <p className="text-sm text-gray-500">
                  Currently: {speciesMap[petData.species] || "Unknown"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-[#4eb7f0]" />
                  Sex
                </label>
                <select
                  name="sex"
                  value={petData.sex}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                  <option value="3">Unknown</option>
                </select>
                <p className="text-sm text-gray-500">
                  Currently: {sexMap[petData.sex] || "Unknown"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Ruler className="w-4 h-4 text-[#4eb7f0]" />
                  Size
                </label>
                <select
                  name="size"
                  value={petData.size}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="1">Small</option>
                  <option value="2">Medium</option>
                  <option value="3">Large</option>
                </select>
                <p className="text-sm text-gray-500">
                  Currently: {sizeMap[petData.size] || "Unknown"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <VenetianMask className="w-4 h-4 text-[#4eb7f0]" />
                  Distinguishing Features
                </label>
                <input
                  type="text"
                  name="distinguishing_features"
                  value={petData.distinguishing_features}
                  onChange={handleChange}
                  placeholder="e.g., Black spot on left ear"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 text-[#4eb7f0]" />
                  Date Lost
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select date"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-[#4eb7f0]" />
                  Last Seen Location
                </label>
                <input
                  type="text"
                  name="nearest_address_last_seen"
                  value={petData.nearest_address_last_seen}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main St"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

             <div className="space-y-2">
                             <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                               <FileText className="w-4 h-4 text-[#4eb7f0]" />
                               Additional Details
                             </label>
                             <textarea
                               name="additional_location_details"
                               value={petData.additional_location_details}
                               onChange={handleChange}
                               placeholder="Any extra information that might help identify your pet"
                               rows={4}
                               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                             />
                           </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-[#4eb7f0]" />
                  Owner Name
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={petData.owner_name}
                  onChange={handleChange}
                  placeholder="Enter owner’s name"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-[#4eb7f0]" />
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={petData.contact_email}
                  onChange={handleChange}
                  placeholder="e.g., owner@example.com"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-[#4eb7f0]" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={petData.phone_number}
                  onChange={handleChange}
                  placeholder="e.g., 123-456-7890"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 text-[#4eb7f0]" />
                  Reward
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                    $
                  </span>
                  <input
                    type="text"
                    name="reward"
                    value={petData.reward}
                    onChange={handleChange}
                    placeholder="e.g., 100"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50">
          <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-medium rounded-full transition-colors duration-200 ${
                isSubmitting
                  ? "bg-[#4eb7f0] opacity-50 cursor-not-allowed"
                  : "bg-[#4eb7f0] hover:bg-[#3a9cd3]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLostReportPage;