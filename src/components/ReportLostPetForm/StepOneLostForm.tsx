"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, ImageIcon, X } from "lucide-react";
import { FormField } from "./FormField";
import Image from "next/image";
import { SpeciesSelector } from "./SpeciesSelector";
import {
  getBreedsBySpecies,
  getCondition,
} from "@server/actions/animal-action";
import { getSize } from "@server/actions/animal-action";
import { LostPetFormData } from "context/petFoundType";

interface StepOneFormProps {
  formData: LostPetFormData;
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

const StepOneLostForm = ({
  formData,
  onInputChange,
  onSpeciesChange,
  onImageUpload,
  setFormData,
  nextStep,
  speciesOptions,
}) => {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [conditionOptions, setConditionOptions] = useState<any[]>([]);

  // Fetch conditions
  useEffect(() => {
    const fetchCondition = async () => {
      try {
        const response = await getCondition();
        if (response.success && response.result) {
          const options = Object.entries(response.result).map(([id, name]) => ({
            id: parseInt(id),
            name,
          }));
          setConditionOptions(options);
          console.log("Fetched conditions:", response.result);
        }
      } catch (error) {
        console.error("Failed to fetch conditions:", error);
      }
    };

    fetchCondition();
  }, []);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await getSize();
        if (response.success && response.result) {
          setSizes(
            Object.entries(response.result).map(([key, value]) => ({
              key: parseInt(key),
              value,
            }))
          );
          console.log("Fetched sizes:", response.result);
        }
      } catch (error) {
        console.error("Failed to fetch sizes:", error);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (formData.species) {
        try {
          const response = await getBreedsBySpecies(formData.species);
          if (response.success && response.result) {
            setBreeds(response.result);
            if (response.result.length > 0 && !formData.breed_id) {
              setFormData((prev) => ({
                ...prev,
                breed_id: response.result[0].id,
              }));
            }
          } else {
            setBreeds([]);
          }
        } catch (error) {
          console.error("Failed to fetch breeds:", error);
          setBreeds([]);
        }
      } else {
        setBreeds([]);
      }
    };

    fetchBreeds();
  }, [formData.species]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "sex") {
      setFormData((prev) => ({
        ...prev,
        sex: value === "Male" ? 1 : 2,
      }));
    } else if (name === "reward") {
      // Ensure reward is stored as a number and remove any non-numeric characters except decimal
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData((prev) => ({
        ...prev,
        reward: numericValue === '' ? '' : Number(numericValue),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image_file: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        image_file: null,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_file: null,
    }));
  };

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
            name="animal_name"
            value={formData.animal_name}
            onChange={handleInputChange}
            placeholder="Enter pet name"
            className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
          />
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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <FormField label="Breed" required={!!formData.species}>
            {breeds.length > 0 ? (
              <select
                name="breed_id"
                value={formData.breed_id}
                onChange={onInputChange}
                required={!!formData.species}
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select breed</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name_en}
                  </option>
                ))}
              </select>
            ) : formData.species ? (
              <select
                name="breed_id"
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                disabled
              >
                <option value="">Loading breeds...</option>
              </select>
            ) : (
              <select
                name="breed_id"
                className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                disabled
              >
                <option value="">Select species first</option>
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
                name="sex"
                value="Male"
                checked={formData.sex === 1}
                onChange={handleInputChange}
                className="mr-2 text-green-500"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={formData.sex === 2}
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
            {sizes.map((sizeOption) => (
              <option key={sizeOption.key} value={sizeOption.key}>
                {sizeOption.value}
              </option>
            ))}
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
          name="date_lost"
          value={formData.date_lost}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
          Reward (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="text"
            name="reward"
            value={formData.reward || ''}
            onChange={handleInputChange}
            placeholder="Enter reward amount"
            className="w-full p-2 pl-8 border rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>
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

        {formData.image_file && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">1 image uploaded</p>
            <div className="relative group">
              <div className="h-32 relative rounded-md overflow-hidden">
                <Image
                  src={URL.createObjectURL(formData.image_file)}
                  alt="Pet image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
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

export default StepOneLostForm;