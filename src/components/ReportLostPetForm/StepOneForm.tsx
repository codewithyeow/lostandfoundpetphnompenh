"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, ImageIcon, X } from "lucide-react";
import FormField from "./FormField";
import Image from "next/image";
import { SpeciesSelector } from "./SpeciesSelector";
import { getBreedsBySpecies } from "@server/actions/animal-action";

interface PetFormData {
  petName: string;
  species: string;
  breed: string;
  color: string;
  gender: string;
  size: string;
  dateFound: string;
  images: File[];
  petCondition: string;
  [key: string]: any;
}

interface StepOneFormProps {
  formData: PetFormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onSpeciesChange: (species: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
  onNextStep: () => void;
}
const StepOneForm = ({
  formData,
  onInputChange,
  onSpeciesChange,
  onImageUpload,
  setFormData,
  handleInputChange,
  handleImageUpload,
  handleRemoveImage,
  nextStep,
  speciesOptions,
}) => {
  const [breeds, setBreeds] = useState<any[]>([]);

  // Fetch breeds when species changes
  useEffect(() => {
    const fetchBreeds = async () => {
      if (formData.species) {
        try {
          const response = await getBreedsBySpecies(formData.species);
          if (response.success && response.result) {
            setBreeds(response.result);
            console.log("Fetched breeds:", response.result);
          } else {
            setBreeds([]);
          }
        } catch (error) {
          console.error("Failed to fetch breeds:", error);
          setBreeds([]); // Reset breeds on error
        }
      } else {
        setBreeds([]);
      }
    };

    fetchBreeds();
  }, [formData.species]);

  return (
    <div className="space-y-3">
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

        {/* Replace species section with SpeciesSelector */}
        <div className="w-full md:w-1/2">
          <SpeciesSelector
            selectedSpecies={formData.species}
            onChange={(selected) =>
              setFormData({ ...formData, species: selected })
            }
            speciesOptions={speciesOptions}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <FormField label="Breed (Optional)" name={""}>
            {breeds.length > 0 ? (
              <select
                name="breed"
                value={formData.breed}
                onChange={onInputChange}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select breed</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.name_en}>
                    {breed.name_en}
                  </option>
                ))}
              </select>
            ) : (
              <select
                name="breed"
                value={formData.breed}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                disabled
              >
                <option value="">No breeds available</option>
              </select>
            )}
          </FormField>
        </div>

        <div className="w-full md:w-1/2">
          <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
            Color
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
          Date Lost
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="date"
          name="dateLost"
          value={formData.dateLost}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
          <ImageIcon className="mr-2 text-green-500" size={16} />
          Upload Pet Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-green-100 file:px-3 file:py-1 file:text-green-500"
        />

        {formData.images.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">
              {formData.images.length}{" "}
              {formData.images.length === 1 ? "image" : "images"} uploaded
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="h-32 relative rounded-md overflow-hidden">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Pet image ${index + 1}`}
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
};

export default StepOneForm;
