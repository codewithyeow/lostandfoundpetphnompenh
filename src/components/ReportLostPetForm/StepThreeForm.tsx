import React from 'react';
import { Phone, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const StepThreeForm = ({ formData, handleInputChange, prevStep }) => {
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
            name="ownerName"
            value={formData.ownerName}
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

      <div className="flex flex-col md:flex-row gap-4">
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

        <div className="w-full md:w-1/2">
          <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
            Reward (Optional)
          </label>
          <input
            type="text"
            name="reward"
            value={formData.reward}
            onChange={handleInputChange}
            placeholder="Enter reward amount"
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
        <h3 className="font-medium text-[#4eb7f0]">
          Review Your Information
        </h3>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Pet Name:</span>
          <span className="text-sm">
            {formData.petName || "Not provided"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Species:</span>
          <span className="text-sm">
            {formData.species || "Not selected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Date Lost:</span>
          <span className="text-sm">
            {formData.dateLost || "Not provided"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Location:</span>
          <span className="text-sm">
            {formData.nearestLocation || "Not provided"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Number of Images:</span>
          <span className="text-sm">{formData.images.length}</span>
        </div>
        {formData.reward && (
          <div className="flex justify-between">
            <span className="font-medium text-sm">Reward:</span>
            <span className="text-sm">{formData.reward}</span>
          </div>
        )}
      </div>

      {formData.images.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-sm mb-2">Uploaded Images</h3>
          <div className="grid grid-cols-3 gap-2">
            {formData.images.slice(0, 3).map((image, index) => (
              <div key={index} className="relative h-24">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Pet image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))}
            {formData.images.length > 3 && (
              <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-sm text-gray-600">
                  +{formData.images.length - 3} more
                </p>
              </div>
            )}
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
          Get Your Pet Back Home
        </button>
      </div>
    </div>
  );
};

export default StepThreeForm;