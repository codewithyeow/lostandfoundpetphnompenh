"use client";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Image as ImageIcon,
  Dog,
  Info,
  ArrowRight,
  ArrowLeft,
  Phone,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import useGoogleMap from "../hook/useGoogleMap";
import {
  CreaterReportLostPetAction, // Changed from CreaterReportFoundPetAction
  getBreedsBySpecies,
  getSpecies,
  getCondition,
} from "@server/actions/animal-action";
import { FormField } from "@component/found-pet-form/FormField";
import { SpeciesSelector } from "@component/ReportLostPetForm/SpeciesSelector";
import { toast } from "react-toastify";
import StepOneLostForm from "@component/ReportLostPetForm/StepOneLostForm"; // Changed to Lost version

export interface LostPetFormData {
  animal_name: string;
  image_file?: File;
  species: string;
  breed_id: string;
  color: string;
  sex: string;
  size: string;
  date_lost: string;
  distinguishing_features: string;
  nearest_address_last_seen: string;
  additional_location_details: string;
  owner_name: string;
  contact_email: string;
  phone_number: string;
  reward: string;
  desc: string;
}

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

export default function ReportLostPetForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    position,
    isLoaded,
    loadError,
    onLoad,
    onUnmount,
    onMarkerLoad,
    onMarkerUnmount,
    setPosition,
    getCurrentLocation,
  } = useGoogleMap(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

  const [formData, setFormData] = useState<LostPetFormData>({
    animal_name: "",
    image_file: undefined,
    species: "",
    breed_id: "",
    color: "",
    sex: "",
    size: "",
    date_lost: "",
    distinguishing_features: "",
    nearest_address_last_seen: "",
    additional_location_details: "",
    owner_name: "",
    contact_email: "",
    phone_number: "",
    reward: "",
    desc: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [speciesData, setSpeciesData] = useState<Record<string, string>>({});
  const [breedOptions, setBreedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSpecies = async () => {
      const result = await getSpecies();
      if (result.success) setSpeciesData(result.result || {});
    };
    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (formData.species) {
        const result = await getBreedsBySpecies(formData.species);
        if (result.success) setBreedOptions(result.result);
      }
    };
    fetchBreeds();
  }, [formData.species]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const [breeds, setBreeds] = useState<any[]>([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (formData.species) {
        try {
          const response = await getBreedsBySpecies(formData.species);
          if (response.success && response.result) {
            setBreeds(response.result);
          } else {
            setBreeds([]);
          }
        } catch (error) {
          console.error("Failed to fetch breeds:", error);
          setBreeds([]);
        }
      } else {
        setBreeds([]);
      }
    };
    fetchBreeds();
  }, [formData.species]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: string[] = [];

    if (!formData.animal_name) validationErrors.push("Pet Name");
    if (!formData.species) validationErrors.push("Species");
    if (!formData.breed_id) validationErrors.push("Breed");
    if (!formData.owner_name) validationErrors.push("Owner Name");
    if (!formData.contact_email) validationErrors.push("Contact Email");
    if (!formData.phone_number) validationErrors.push("Phone Number");
    if (!formData.date_lost) validationErrors.push("Date Lost");

    if (validationErrors.length > 0) {
      const errorMessage = `Please fill in these required fields: ${validationErrors.join(", ")}`;
      console.error(errorMessage);
      alert(errorMessage);
      return;
    }

    const submissionData = new FormData();

    try {
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof LostPetFormData];
        if (value !== null && value !== "") {
          if (key === "image_file" && value instanceof File) {
            submissionData.append(key, value, value.name);
          } else {
            submissionData.append(key, String(value));
          }
        }
      });

      for (const [key, value] of Array.from(submissionData.entries())) {
        console.log(`Submitting - Key: ${key}, Value:`, value);
      }

      setIsSubmitting(true);

      const response = await CreaterReportLostPetAction(submissionData); 
      console.log("response from api", response);

      if (response.success) {
        toast.success("Lost pet report successfully created!");
        router.push("/");
      } else {
        console.error("Submission Error Details:", {
          message: response.message,
          errors: response.errors,
        });
        alert(response.message || "Submission failed");
      }
    } catch (error) {
      console.error("Unexpected submission error:", error);
      alert("An unexpected error occurred. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [speciesError, setSpeciesError] = useState<string | null>(null);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOneLostForm
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
          nextStep={nextStep}
          speciesOptions={speciesOptions}
          onSpeciesChange={undefined}
          onImageUpload={undefined}
          />
        );

      case 2:
        return (
          <>
            <div className="space-y-3">
              <div>
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <MapPin className="mr-2 text-green-500" size={16} />
                  Last Seen Location
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="nearest_address_last_seen"
                  value={formData.nearest_address_last_seen}
                  onChange={handleInputChange}
                  placeholder="Enter the nearest street address or intersection"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <Info className="mr-2 text-green-500" size={16} />
                  Additional Location Details (Optional)
                </label>
                <textarea
                  name="additional_location_details"
                  value={formData.additional_location_details}
                  onChange={handleInputChange}
                  placeholder="Provide any additional details about where the pet was last seen (landmarks, nearby buildings, etc.)"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <Info className="mr-2 text-green-500" size={16} />
                  Distinguishing Features (Optional)
                </label>
                <textarea
                  name="distinguishing_features"
                  value={formData.distinguishing_features}
                  onChange={handleInputChange}
                  placeholder="Enter any distinguishing features, collar, tags, or microchip info"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4 gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center text-[#4eb7f0] border border-[#4eb7f0] font-medium text-sm py-2 px-4 rounded-full hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="mr-1" size={16} />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center text-white bg-[#4eb7f0] font-medium text-sm py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                Next: Your Info
                <ArrowRight className="ml-1" size={16} />
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Owner Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Contact Email
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                <Phone className="mr-2 text-green-500" size={16} />
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="signUp"
                className="mr-2 text-green-500"
              />
              <label htmlFor="signUp" className="text-sm">
                Sign me up for local lost & found pet alerts
              </label>
            </div>

            <div className="bg-gray-50 p-3 rounded-md space-y-2 mt-4">
              <h3 className="font-medium text-[#4eb7f0]">
                Review Your Information
              </h3>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Pet Name:</span>
                <span className="text-sm">
                  {formData.animal_name || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Date Lost:</span>
                <span className="text-sm">
                  {formData.date_lost || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Last Seen Location:</span>
                <span className="text-sm">
                  {formData.nearest_address_last_seen || "Not provided"}
                </span>
              </div>
              {formData.reward && (
                <div className="flex justify-between">
                  <span className="font-medium text-sm">Reward:</span>
                  <span className="text-sm">${formData.reward}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4 gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center text-[#4eb7f0] border border-[#4eb7f0] font-medium text-sm py-2 px-4 rounded-full hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowLeft className="mr-1" size={16} />
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center text-white bg-[#4eb7f0] font-medium text-sm py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Report Lost Pet"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Report a Lost Pet
        </h2>
        <p className="text-center text-gray-600">
          Let's help bring your pet home
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-6">
          <div
            className={`flex flex-col items-center ${
              currentStep >= 1 ? "text-[#4eb7f0]" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentStep >= 1 ? "bg-[#4eb7f0] text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="text-xs mt-1">Pet Info</span>
          </div>
          <div
            className={`flex-1 border-t border-gray-300 self-center mx-2`}
          ></div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= 2 ? "text-[#4eb7f0]" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentStep >= 2 ? "bg-[#4eb7f0] text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="text-xs mt-1">Location</span>
          </div>
          <div
            className={`flex-1 border-t border-gray-300 self-center mx-2`}
          ></div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= 3 ? "text-[#4eb7f0]" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentStep >= 3 ? "bg-[#4eb7f0] text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="text-xs mt-1">Contact</span>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </form>
  );
}