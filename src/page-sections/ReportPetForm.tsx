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

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

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
    locationCoordinates: position, // Use the position from the hook
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and append to existing images
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
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Pet Name (if known)
                </label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  placeholder="Enter pet name if known"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <Dog className="mr-2 text-green-500" size={16} />
                  Species
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {speciesOptions.map((species) => (
                    <div
                      key={species.value}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          species: species.value,
                        }))
                      }
                      className={`
                        cursor-pointer flex items-center justify-center p-1 rounded-md text-sm transition-all 
                        ${
                          formData.species === species.value
                            ? "bg-[#4eb7f0] text-white"
                            : "bg-white text-green-500 border border-green-500 hover:bg-green-50"
                        }
                      `}
                    >
                      {species.icon}
                      {species.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Breed (Optional)
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Enter breed if known"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Color
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Enter color"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Gender (Optional)
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                      className="mr-2 text-green-500"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                      className="mr-2 text-green-500"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Size (Optional)
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                <Calendar className="mr-2 text-green-500" size={16} />
                Date Found
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="dateFound"
                value={formData.dateFound}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                <ImageIcon className="mr-2 text-green-500" size={16} />
                Upload Pet Images
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                multiple
                className="w-full p-2 border rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-green-100 file:px-3 file:py-1 file:text-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple images at once
              </p>

              {formData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">
                    Uploaded Images ({formData.images.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-32 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Uploaded pet ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                <Info className="mr-2 text-green-500" size={16} />
                Pet's Condition
              </label>
              <select
                name="petCondition"
                value={formData.petCondition}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select condition</option>
                <option value="Healthy">Healthy</option>
                <option value="Injured">Injured</option>
                <option value="Needs care">Needs care</option>
                <option value="Unsure">Unsure</option>
              </select>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-2 px-4 bg-white font-medium rounded-full border border-[#4eb7f0] text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200"
              >
                Next: Location Information
                <ArrowRight className="ml-1 inline" size={16} />
              </button>
            </div>
          </div>
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
                  name="nearestLocation"
                  value={formData.nearestLocation}
                  onChange={handleInputChange}
                  placeholder="Enter the nearest street address or intersection"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="mt-3">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <MapPin className="mr-2 text-green-500" size={16} />
                  Pin Exact Location on Map
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Click on the map to pin the exact location where you found the
                  pet
                </p>
                <div className="w-full h-64 rounded-md overflow-hidden border border-gray-300">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={formData.locationCoordinates}
                      zoom={15}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                      onClick={handleMapClick}
                    >
                      <Marker
                        position={formData.locationCoordinates}
                        onLoad={onMarkerLoad}
                        onUnmount={onMarkerUnmount}
                        draggable={true}
                        onDragEnd={(e) => {
                          if (e.latLng) {
                            const newPosition = {
                              lat: e.latLng.lat(),
                              lng: e.latLng.lng(),
                            };
                            setPosition(newPosition);
                            setFormData((prev) => ({
                              ...prev,
                              locationCoordinates: newPosition,
                            }));
                          }
                        }}
                      />
                    </GoogleMap>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p>Loading map...</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-green-500">
                    Location coordinates:{" "}
                    {formData.locationCoordinates.lat.toFixed(6)},{" "}
                    {formData.locationCoordinates.lng.toFixed(6)}
                  </p>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="text-xs text-[#4eb7f0] hover:underline"
                  >
                    Use my current location
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <Info className="mr-2 text-green-500" size={16} />
                  Additional Location Details (Optional)
                </label>
                <textarea
                  name="locationDetails"
                  value={formData.locationDetails}
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
                  name="distinguishingFeatures"
                  value={formData.distinguishingFeatures}
                  onChange={handleInputChange}
                  placeholder="Enter any distinguishing features, collar, tags, or microchip info if available"
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
                  name="finderName"
                  value={formData.finderName}
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
                  name="contactEmail"
                  value={formData.contactEmail}
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
                name="phone"
                value={formData.phone}
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
                  {formData.dateFound || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Location:</span>
                <span className="text-sm">
                  {formData.nearestLocation || "Not provided"}
                </span>
              </div>
              {formData.petCondition && (
                <div className="flex justify-between">
                  <span className="font-medium text-sm">Pet Condition:</span>
                  <span className="text-sm">{formData.petCondition}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-sm">Images:</span>
                <span className="text-sm">
                  {formData.images.length} uploaded
                </span>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Uploaded Images:</h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-16 overflow-hidden rounded-md">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded pet ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                className="flex items-center justify-center text-white bg-[#4eb7f0] font-medium text-sm py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-200"
              >
                Report Found Pet
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-400 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        {/* Left side content */}
        <div className="w-full lg:w-1/2 text-white mb-6 lg:mb-0 lg:pr-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Report a Found Pet
          </h1>
          <p className="text-lg">
            Have you found a pet in Phnom Penh and want to help reunite it with
            its owner? LOST & FOUND PHNOM PENH is a free platform that connects
            found pets with their worried owners. By reporting a found pet,
            you're giving someone hope of finding their beloved companion. Our
            system will match your found pet report with any lost pet alerts in
            the area, increasing the chances of a happy reunion. Fill out the
            form to post your found pet on LOST & FOUND PHNOM PENH today.
          </p>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-1/2">
          <Card className="w-full shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-[#4eb7f0]">
                {currentStep === 1
                  ? "Help Reunite a Pet with Its Owner"
                  : `Report Found Pet - Step ${currentStep} of 3`}
              </CardTitle>
              {currentStep === 1 && (
                <p className="text-sm text-gray-500">
                  Enter information about the pet you've found to help locate
                  its owner.
                </p>
              )}
              {/* Step indicator */}
              <div className="flex justify-center mt-2">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                          ${
                            currentStep === step
                              ? "bg-[#4eb7f0] text-white"
                              : currentStep > step
                              ? "bg-green-100 text-green-500 border border-green-500"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-10 h-1 ${
                            currentStep > step ? "bg-[#4eb7f0]" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-2">
                {renderStepContent()}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
