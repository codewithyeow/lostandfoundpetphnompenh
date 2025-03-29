import React from 'react';
import { MapPin, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const StepTwoForm = ({ 
  formData, 
  setFormData, 
  handleInputChange, 
  handleMapClick, 
  setPosition, 
  isLoaded, 
  mapContainerStyle, 
  onLoad, 
  onUnmount, 
  onMarkerLoad, 
  onMarkerUnmount, 
  getCurrentLocation, 
  prevStep, 
  nextStep 
}) => {
  return (
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
          placeholder="Enter any distinguishing features, habits, or behaviors"
          className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          rows={3}
        />
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
    </div>
  );
};

export default StepTwoForm;