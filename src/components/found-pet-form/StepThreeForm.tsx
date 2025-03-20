import React from "react";
import Image from "next/image";
import { Phone, ArrowLeft } from "lucide-react";

interface StepThreeFormProps {
  formData: {
    finderName: string;
    contactEmail: string;
    phone: string;
    species: string;
    dateFound: string;
    nearestLocation: string;
    petCondition: string;
    images: File[];
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  prevStep: () => void;
}

export const StepThreeForm: React.FC<StepThreeFormProps> = ({
  formData,
  onInputChange,
  prevStep,
}) => {
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
            onChange={onInputChange}
            placeholder="Enter your name"
            className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            required
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
            onChange={onInputChange}
            placeholder="Enter your email"
            className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            required
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
          onChange={onInputChange}
          placeholder="Enter your phone number"
          className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          required
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
              <div key={index} className="relative h-24">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded pet ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
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
};