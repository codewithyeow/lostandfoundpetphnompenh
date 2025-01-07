"use client";

import React, { useState } from "react";
import Button from "../components/buttons/Button";

interface SpeciesOption {
  value: string;
  label: string;
}

export default function ReportPetForm() {
  const [selectedSpecies, setSelectedSpecies] = useState<string>(""); // Species selection state
  const [location, setLocation] = useState<string>(""); // Location state
  const [showMap, setShowMap] = useState<boolean>(false); // Control Google Maps popup
  const [image, setImage] = useState<File | null>(null); // Pet image state

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // Handle form submission logic
  };

  const speciesOptions: SpeciesOption[] = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Bird", label: "Bird" },
    { value: "Other", label: "Other" },
  ]; // Species options

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#E4EAEE] shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Report Found Pet</h2>

      <form onSubmit={handleSubmit}>
        {/* Pet Status */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Pet Status</p>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Found Pet</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Found/Stray Pet</span>
            </label>
          </div>
        </div>

        {/* Pet Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Pet Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter pet name"
          />
        </div>

        {/* Date Last Seen */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Date Last Seen</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Nearest Location */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nearest Location</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter nearest location"
          />
        </div>

        {/* Pin Location (Google Maps) */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Location Found</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter location or use map"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            type="button"
            className="mt-2 text-blue-500 underline"
            onClick={() => setShowMap(true)}
          >
            Pin location on map
          </button>

          {showMap && (
            <div className="w-full h-64 mt-4 border">
              {/* Google Maps implementation */}
              <p>Google Map will be here...</p>
            </div>
          )}
        </div>

        {/* Pet Image Upload */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Pet Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded pet"
                className="max-w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Species Selection */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Species</label>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="" disabled>
              Select species
            </option>
            {speciesOptions.map((species) => (
              <option key={species.value} value={species.value}>
                {species.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          variant="contained"
          size="large"
          width="100%"
          height="40px"
          style={{ fontSize: "16px", backgroundColor: "#2463EB" }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
