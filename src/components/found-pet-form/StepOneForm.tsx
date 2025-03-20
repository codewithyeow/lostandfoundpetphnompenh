"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Info, ArrowRight } from "lucide-react";
import { FormField } from "./FormField";
import { SpeciesSelector } from "./SpeciesSelector";
import { ImageUploader } from "./ImageUploader";
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
  setFormData,
  handleInputChange,
  handleImageUpload,
  handleRemoveImage,
  onSpeciesChange,
  onImageUpload,
  onImageRemove,
  nextStep,
  speciesOptions,
  onNextStep,
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
    <div className="space-y-4">
      {/* Pet Basic Information Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <FormField label="Pet Name (if known)" name={""} required>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={onInputChange}
              placeholder="Enter pet name if known"
              className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </FormField>
        </div>

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

      {/* Breed and Color Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <FormField label="Breed (Optional)" name={""} required>
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
          <FormField label="Color" name={""} required>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={onInputChange}
              placeholder="Enter color"
              className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </FormField>
        </div>
      </div>

      {/* Gender and Size Row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
        <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
          <FormField label="Gender (Optional)" name={""} required>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={onInputChange}
                  className="mr-2 text-green-500"
                />
                Male
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={onInputChange}
                  className="mr-2 text-green-500"
                />
                Female
              </label>

            </div>
          </FormField>
          </label>
        </div>

        <div className="w-full md:w-1/2">
          <FormField label="Size (Optional)" name={""} required>
            <select
              name="size"
              value={formData.size}
              onChange={onInputChange}
              className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Date Found Field */}
      <FormField
        label="Date Found"
        name=""
        required
        icon={<Calendar size={16} />}
      >
        <input
          type="date"
          name="dateFound"
          value={formData.dateFound}
          onChange={onInputChange}
          className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          required
        />
      </FormField>

      {/* Image Upload Section */}
      <ImageUploader
        images={formData.images}
        onUpload={onImageUpload}
        onRemove={onImageRemove}
      />

      {/* Pet Condition Field */}
      <FormField label="Pet's Condition" name="" icon={<Info size={16} />}>
        <select
          name="petCondition"
          value={formData.petCondition}
          onChange={onInputChange}
          className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select condition</option>
          <option value="Healthy">Healthy</option>
          <option value="Injured">Injured</option>
          <option value="Needs care">Needs care</option>
          <option value="Unsure">Unsure</option>
        </select>
      </FormField>

      {/* Navigation Button */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={onNextStep}
          className="w-full py-2 px-4 bg-white font-medium rounded-full border border-[#4eb7f0] text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200 flex items-center justify-center"
        >
          Next: Location Information
          <ArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepOneForm;
