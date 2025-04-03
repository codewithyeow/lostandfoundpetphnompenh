"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
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
  CreaterReportFoundPetAction,
  getBreedsBySpecies,
  getSpecies,
  getCondition,
} from "@server/actions/animal-action";
import { FormField } from "@component/found-pet-form/FormField";
import { SpeciesSelector } from "@component/ReportLostPetForm/SpeciesSelector";
import { FoundPetFormData } from "context/petFoundType";
import { toast } from "react-toastify";
import StepOneFoundForm from "@component/found-pet-form/StepOneFoundForm";
import { useAuthContext } from "context/auth-context/AuthContext";
import { string } from "yup";

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const validateImageUpload = (file: File | null, maxSizeMB: number = 5): boolean => {
  if (!file) {
    toast.error("Please select an image to upload");
    return false;
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    toast.error(`Image size too large. Maximum allowed size is ${maxSizeMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
    return false;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Invalid file type. Please upload JPG, PNG, or GIF images only");
    return false;
  }

  return true; 
};

export default function ReportFoundPetForm() {
  const router = useRouter();
  const { status } = useAuthContext();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    position,
    isLoaded,
    loadError,
    onLoad,
    onMarkerLoad,
    onMarkerUnmount,
    setPosition,
    getCurrentLocation,
  } = useGoogleMap(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
  const [formData, setFormData] = useState<FoundPetFormData>({
    animal_name: "",
    image_file: undefined ,
    species: "",
    breed_id: 0, // Changed from "" to 0
    color: "",
    sex: 0,
    size: 0,
    date_found: "",
    condition: 0,
    distinguishing_features: "",
    where_pet_was_found: "",
    additional_location_details: "",
    your_name: "",
    contact_email: "",
    phone_number: "",
    desc: "",
    location_coordinates: { lat: 0, lng: 0 },
  });
  const [speciesData, setSpeciesData] = useState<Record<string, string>>({});
  const [breedOptions, setBreedOptions] = useState<Record<string, string>>({});
  const [breeds, setBreeds] = useState<any[]>([]);
  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateImageUpload(file)) {
        setFormData((prev) => ({
          ...prev,
          image_file: file,
        }));
        toast.success("Image uploaded successfully");
      } else {
        event.target.value = '';
      }
    }
  };

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

  const nextStep = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      setLoading(false);
    }, 500);
  };

  const prevStep = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      setLoading(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: string[] = [];

    if (!formData.animal_name) validationErrors.push("Pet Name");
    if (!formData.species) validationErrors.push("Species");
    if (!formData.breed_id) validationErrors.push("Breed");
    if (!formData.date_found) validationErrors.push("Date Found");
    if (!formData.your_name) validationErrors.push("Your Name");
    if (!formData.contact_email) validationErrors.push("Contact Email");
    if (!formData.phone_number) validationErrors.push("Phone Number");
    if (formData.image_file && !validateImageUpload(formData.image_file)) {
      validationErrors.push("Image");
    }

    if (validationErrors.length > 0) {
      const errorMessage = `Please fill in these required fields: ${validationErrors.join(", ")}`;
      toast.error(errorMessage);
      return;
    }

    const submissionData = new FormData();

    try {
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof FoundPetFormData];
        if (value !== null && value !== "" && value !== 0) {
          if (key === "image_file" && value instanceof File) {
            submissionData.append(key, value, value.name);
          } else {
            submissionData.append(key, String(value));
          }
        }
      });

      setIsSubmitting(true);
      const response = await CreaterReportFoundPetAction(submissionData);

      if (response.success) {
        toast.success("Report found pet successfully created!");
        router.push("/");
      } else {
        toast.error(response.message || "Submission failed");
      }
    } catch (error) {
      console.error("Unexpected submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status !== "loggedIn") {
    return null;
  }
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOneFoundForm
            formData={formData}
            setFormData={setFormData}
            onInputChange={handleInputChange}
            nextStep={nextStep}
            speciesOptions={speciesOptions}
            onSpeciesChange={(species: string) => 
              setFormData((prev) => ({ ...prev, species }))
            }
            onImageUpload={handleImageUpload}
          />
        );

      case 2:
        return (
          <>
            <div className="space-y-3">
              <div>
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <MapPin className="mr-2 text-green-500" size={16} />
                  Where Pet Was Found
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="where_pet_was_found"
                  value={formData.where_pet_was_found}
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
                  placeholder="Provide any additional details about the location that might help (landmarks, nearby buildings, etc.)"
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
                  placeholder="Enter any distinguishing features, collar, tags, or microchip info if available"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <Info className="mr-2 text-green-500" size={16} />
                  Description (Optional)
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  placeholder="Provide a general description of the pet (e.g., behavior, appearance, any notable traits)"
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
                  Your Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="your_name"
                  value={formData.your_name}
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
                <span className="font-medium text-sm">Pet Type:</span>
                <span className="text-sm">
                  {formData.species || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Date Found:</span>
                <span className="text-sm">
                  {formData.date_found || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Location:</span>
                <span className="text-sm">
                  {formData.where_pet_was_found || "Not provided"}
                </span>
              </div>
              {formData.desc && (
                <div className="flex justify-between">
                  <span className="font-medium text-sm">Description:</span>
                  <span className="text-sm">{formData.desc}</span>
                </div>
              )}
              {formData.condition && (
                <div className="flex justify-between">
                  <span className="font-medium text-sm">Pet Condition:</span>
                  <span className="text-sm">{formData.condition}</span>
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
                className={`flex items-center justify-center text-white bg-[#4eb7f0] font-medium text-sm py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Report Found Pet"}
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
          Report a Found Pet
        </h2>
        <p className="text-center text-gray-600">
          Let's help bring this pet home
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