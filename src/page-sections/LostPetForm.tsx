import React, { useState, useCallback } from "react";
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
import StepOneForm from "@component/ReportLostPetForm/StepOneForm";
import StepTwoForm from "@component/ReportLostPetForm/StepTwoForm";
import StepThreeForm from "@component/ReportLostPetForm/StepThreeForm";

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
    dateLost: "",
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
    ownerName: "",
    reward: "",
    status: "Lost",
    locationCoordinates: position, 
  });

  const speciesOptions: SpeciesOption[] = [
    { value: "Dog", label: "Dog", icon: <Dog className="mr-2" size={18} /> },
    { value: "Cat", label: "Cat", icon: <Dog className="mr-2" size={18} /> },
    { value: "Bird", label: "Bird", icon: <Dog className="mr-2" size={18} /> },
    {
      value: "Other",
      label: "Other",
      icon: <Dog className="mr-2" size={18} />,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = [...formData.images];
      for (let i = 0; i < files.length; i++) {
        newImages.push(files[i]);
      }

      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }));

      // Reset the input value to allow selecting the same file again
      event.target.value = "";
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/confirmation");
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
            speciesOptions={speciesOptions} onSpeciesChange={undefined} onImageUpload={undefined}          />
        );
      case 2:
        return (
          <StepTwoForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleMapClick={handleMapClick}
            setPosition={setPosition}
            isLoaded={isLoaded}
            mapContainerStyle={mapContainerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onMarkerLoad={onMarkerLoad}
            onMarkerUnmount={onMarkerUnmount}
            getCurrentLocation={getCurrentLocation}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <StepThreeForm
            formData={formData}
            handleInputChange={handleInputChange}
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
        <h2 className="text-2xl font-bold text-center text-gray-800">Report a Lost Pet</h2>
        <p className="text-center text-gray-600">Let's help bring your pet home</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-6">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-[#4eb7f0]" : "text-gray-400"}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 1 ? "bg-[#4eb7f0] text-white" : "bg-gray-200"}`}>
              1
            </div>
            <span className="text-xs mt-1">Pet Info</span>
          </div>
          <div className={`flex-1 border-t border-gray-300 self-center mx-2`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-[#4eb7f0]" : "text-gray-400"}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 2 ? "bg-[#4eb7f0] text-white" : "bg-gray-200"}`}>
              2
            </div>
            <span className="text-xs mt-1">Location</span>
          </div>
          <div className={`flex-1 border-t border-gray-300 self-center mx-2`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 3 ? "text-[#4eb7f0]" : "text-gray-400"}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 3 ? "bg-[#4eb7f0] text-white" : "bg-gray-200"}`}>
              3
            </div>
            <span className="text-xs mt-1">Contact</span>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </form>
  );
};
