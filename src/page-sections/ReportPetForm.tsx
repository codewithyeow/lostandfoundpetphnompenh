import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Image as ImageIcon, Dog, Info, ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import useGoogleMap from '../hook/useGoogleMap';

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

export default function ReportFoundPetForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Properly use the hook inside the component
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
    dateSeen: "",
    image: null as File | null,
    nearestLocation: "",
    lat: position.lat,
    lng: position.lng,
    locationDetails: "",
    species: "",
    contactEmail: "",
    phone: "",
    status: "Found",
    locationCoordinates: position // Use the position from the hook
  });

  const speciesOptions: SpeciesOption[] = [
    { value: "Dog", label: "Dog", icon: <Dog className="mr-2" size={18} /> },
    { value: "Cat", label: "Cat", icon: <Dog className="mr-2" size={18} /> },
    { value: "Bird", label: "Bird", icon: <Dog className="mr-2" size={18} /> },
    { value: "Other", label: "Other", icon: <Dog className="mr-2" size={18} /> },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setPosition(newPosition);
      setFormData(prev => ({
        ...prev,
        locationCoordinates: newPosition
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/confirmation");
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Pet Status
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Lost"
                      checked={formData.status === "Lost"}
                      onChange={handleInputChange}
                      className="mr-2 text-green-500"
                    />
                    Lost
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="Found"
                      checked={formData.status === "Found"}
                      onChange={handleInputChange}
                      className="mr-2 text-green-500"
                    />
                    Found/Stray
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  Pet Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  placeholder="Enter pet name"
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                  <Dog className="mr-2 text-green-500" size={16} />
                  Species
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {speciesOptions.map((species) => (
                    <div
                      key={species.value}
                      onClick={() => setFormData(prev => ({ ...prev, species: species.value }))}
                      className={`
                        cursor-pointer flex items-center justify-center p-1 rounded-md text-sm transition-all 
                        ${formData.species === species.value 
                          ? 'bg-[#4eb7f0] text-white' 
                          : 'bg-white text-green-500 border border-green-500 hover:bg-green-50'
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

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                <Calendar className="mr-2 text-green-500" size={16} />
                Date Last Seen
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="dateSeen"
                value={formData.dateSeen}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
                <ImageIcon className="mr-2 text-green-500" size={16} />
                Upload Pet Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-green-100 file:px-3 file:py-1 file:text-green-500"
              />
              {formData.image && (
                <div className="mt-2 relative w-full h-40 overflow-hidden rounded-md">
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="Uploaded pet"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
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
                  Nearest Address Last Seen
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
                <p className="text-xs text-gray-500 mb-2">Click on the map to pin the exact location where the pet was {formData.status === "Lost" ? "last seen" : "found"}</p>
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
                              lng: e.latLng.lng()
                            };
                            setPosition(newPosition);
                            setFormData(prev => ({
                              ...prev,
                              locationCoordinates: newPosition
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
                    Location coordinates: {formData.locationCoordinates.lat.toFixed(6)}, {formData.locationCoordinates.lng.toFixed(6)}
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
                Next: Contact Info
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

              <div className="w-full md:w-1/2">
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
              <h3 className="font-medium text-[#4eb7f0]">Review Your Information</h3>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Pet Name:</span>
                <span className="text-sm">{formData.petName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Status:</span>
                <span className="text-sm">{formData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Date Seen:</span>
                <span className="text-sm">{formData.dateSeen || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Species:</span>
                <span className="text-sm">{formData.species || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Location:</span>
                <span className="text-sm">{formData.nearestLocation || 'Not provided'}</span>
              </div>
            </div>

            {formData.image && (
              <div className="relative w-full h-40 overflow-hidden rounded-md">
                <Image
                  src={URL.createObjectURL(formData.image)}
                  alt="Uploaded pet"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
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
                Get Your Pet Back Home
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get Help Finding Your Lost Pet</h1>
          <p className="text-lg">
            Have you lost your pet and don't know where to start your search? Losing a pet can be a heartbreaking experience, but  LOST & FOUND PHNOM PENH can help.  LOST & FOUND PHNOM PENH is a free platform that acts as an Amber Alert for missing pets. With LOST & FOUND PHNOM PENH, you can raise local awareness about your missing animal friend and boost your chances of a safe and happy reunion. Fill out the form to post your pet on  LOST & FOUND PHNOM PENH today.
          </p>
        </div>
        
        {/* Right side form */}
        <div className="w-full lg:w-1/2">
          <Card className="w-full shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-[#4eb7f0]">
                {currentStep === 1 ? "Start Your Free Alert" : `Report ${formData.status} Pet - Step ${currentStep} of 3`}
              </CardTitle>
              {currentStep === 1 && (
                <p className="text-sm text-gray-500">
                  Enter your pet's information to instantly start spreading local awareness.
                </p>
              )}
              {/* Step indicator */}
              <div className="flex justify-center mt-2">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                          ${currentStep === step 
                            ? 'bg-[#4eb7f0] text-white' 
                            : currentStep > step 
                              ? 'bg-green-100 text-green-500 border border-green-500' 
                              : 'bg-gray-100 text-gray-400'}
                        `}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-10 h-1 ${currentStep > step ? 'bg-[#4eb7f0]' : 'bg-gray-200'}`}></div>
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