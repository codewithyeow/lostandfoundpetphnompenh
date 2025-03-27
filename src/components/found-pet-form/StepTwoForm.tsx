import React from "react";
import { MapPin, Info, ArrowLeft, ArrowRight } from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface StepTwoFormProps {
  formData: {
    where_pet_was_found: string;
    additional_location_details: string;
    distinguishing_features: string;

    // location_coordinates: string;  
    locationCoordinates: {
      lat: number;
      lng: number;
    };
  };
  isLoaded: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onMapClick: (event: google.maps.MapMouseEvent) => void;
  onLoad: (map: google.maps.Map) => void;
  onUnmount: (map: google.maps.Map) => void;
  onMarkerLoad: (marker: google.maps.Marker) => void;
  onMarkerUnmount: (marker: google.maps.Marker) => void;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
  getCurrentLocation: () => void;
  prevStep: () => void;
  nextStep: () => void;
}

export const StepTwoForm: React.FC<StepTwoFormProps> = ({
  formData,
  isLoaded,
  onInputChange,
  onMapClick,
  onLoad,
  onUnmount,
  onMarkerLoad,
  onMarkerUnmount,
  onMarkerDragEnd,
  getCurrentLocation,
  prevStep,
  nextStep,
}) => {
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

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
            onChange={onInputChange}
            placeholder="Enter the nearest street address or intersection"
            className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="mt-3">
          <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <MapPin className="mr-2 text-green-500" size={16} />
            Pin Exact Location on Map
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Click on the map to pin the exact location where you found the pet
          </p>
          <div className="w-full h-64 rounded-md overflow-hidden border border-gray-300">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={formData.locationCoordinates}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onMapClick}
              >
                <Marker
                  position={formData.locationCoordinates}
                  onLoad={onMarkerLoad}
                  onUnmount={onMarkerUnmount}
                  draggable={true}
                  onDragEnd={onMarkerDragEnd}
                />
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p>Loading map...</p>
              </div>
            )}
          </div>
          {/* <div className="flex justify-between items-center mt-2">
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
          </div> */}
        </div>

        <div>
          <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
            <Info className="mr-2 text-green-500" size={16} />
            Additional Location Details (Optional)
          </label>
          <textarea
            name="additional_location_details"
            value={formData.additional_location_details}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
};