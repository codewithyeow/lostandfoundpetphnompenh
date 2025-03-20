import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useGoogleMap from "../hook/useGoogleMap";
import StepOneForm from "../components/found-pet-form/StepOneForm";
import { StepTwoForm } from "../components/found-pet-form/StepTwoForm";
import { StepThreeForm } from "../components/found-pet-form/StepThreeForm";
import { reportFoundPetAction } from "../server/actions/animal-action";
import { getSpecies } from "../server/actions/animal-action";

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export default function ReportFoundPetForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
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

  const [formData, setFormData] = useState({
    petName: "",
    dateFound: "",
    images: [] as File[],
    nearestLocation: "",
    lat: position.lat,
    lng: position.lng,
    locationDetails: "",
    species: "",
    breed: "",
    color: "",
    size: "",
    gender: "",
    age: "",
    distinguishingFeatures: "",
    contactEmail: "",
    phone: "",
    finderName: "",
    petCondition: "",
    status: "Found",
    locationCoordinates: position,
  });

  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [speciesError, setSpeciesError] = useState<string | null>(null);

  const handleSpeciesChange = (species: string) => {
    setFormData((prev) => ({
      ...prev,
      species,
    }));
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setPosition(newPosition);
      setFormData((prev) => ({
        ...prev,
        locationCoordinates: newPosition,
      }));
    }
  };
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setFormData((prev) => ({
        ...prev,
        locationCoordinates: newPosition,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await reportFoundPetAction({
        animal_name: formData.petName,
        date_last_seen: formData.dateFound,
        image_file: formData.images[0], // assuming only one image
        nearest_location: formData.nearestLocation,
        species: formData.species,
        breed_id: formData.breed,
      });

      if (result.success) {
        // Redirect or show a success message
        router.push("/confirmation");
      } else {
        // Handle error message
        console.error(result.message);
        alert("Failed to report pet: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error reporting the pet. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOneForm
            formData={formData}
            setFormData={setFormData}
            onInputChange={handleInputChange}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            nextStep={nextStep}
            speciesOptions={speciesOptions}
            onSpeciesChange={undefined}
            onImageUpload={undefined}
          />
        );
      case 2:
        return (
          <StepTwoForm
            formData={formData}
            isLoaded={isLoaded}
            onInputChange={handleInputChange}
            onMapClick={handleMapClick}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onMarkerLoad={onMarkerLoad}
            onMarkerUnmount={onMarkerUnmount}
            onMarkerDragEnd={handleMarkerDragEnd}
            getCurrentLocation={getCurrentLocation}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );

      case 3:
        return (
          <StepThreeForm
            formData={formData}
            onInputChange={handleInputChange}
            prevStep={prevStep}
          />
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
