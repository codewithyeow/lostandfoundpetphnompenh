import React, { useState } from "react";
import Button from "../components/buttons/Button";
import { useRouter } from "next/navigation";
import { FaDog, FaMapMarkerAlt, FaImage } from "react-icons/fa";

interface SpeciesOption {
  value: string;
  label: string;
}

export default function ReportLostPetForm() {
  const router = useRouter();
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [lastSeenLocation, setLastSeenLocation] = useState<string>("");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    router.push("/confirmation");
  };

  const speciesOptions: SpeciesOption[] = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Bird", label: "Bird" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="bg-[#E4EAEE] min-h-screen flex flex-col px-4 py-2 w-full">
      <div className="sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm flex-1">
        <h2 className="mt-10 text-center font-bold leading-9 tracking-tight text-customGray lg:text-2xl text-lg">
          Report Lost Pet - Step {currentStep} of 3
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm flex-1">
        <form onSubmit={handleSubmit} className="space-y-6 lg:p-8 p-4 bg-white rounded-lg shadow-md">
          {/* Step 1: Pet Information + Upload Image */}
          {currentStep === 1 && (
            <>
              <div className="flex items-center mb-4">
                <FaDog className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Pet Name
                </label>
              </div>
              <input
                type="text"
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                placeholder="Enter pet name"
              />

              <div className="flex items-center mb-4 mt-6">
                <FaMapMarkerAlt className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Date Last Seen
                </label>
              </div>
              <input
                type="date"
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
              />

              {/* Image Upload Section */}
              <div className="flex items-center mb-4 mt-6">
                <FaImage className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Upload Pet Image (optional)
                </label>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="lg:text-lg"
              />
              {image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded pet"
                    className="max-w-full lg:h-60 h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex justify-between mt-6 flex-wrap">
                <Button
                  variant="outlined"
                  size="large"
                  width="48%"
                  height="48px"
                  style={{ fontSize: "16px", borderColor: "#2463EB", color: "#2463EB" }}
                  onClick={() => setCurrentStep(2)}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Location and Species */}
          {currentStep === 2 && (
            <>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Last Seen Location
                </label>
              </div>
              <input
                type="text"
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                value={lastSeenLocation}
                onChange={(e) => setLastSeenLocation(e.target.value)}
                placeholder="Enter the last location where your pet was seen"
              />

              <div className="flex items-center mb-4 mt-6">
                <FaDog className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Species
                </label>
              </div>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
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

              <div className="flex justify-between mt-6 flex-wrap">
                <Button
                  variant="outlined"
                  size="large"
                  width="48%"
                  height="48px"
                  style={{ fontSize: "16px", borderColor: "#2463EB", color: "#2463EB" }}
                  onClick={() => setCurrentStep(1)}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  width="48%"
                  height="48px"
                  style={{ fontSize: "16px", backgroundColor: "#2463EB" }}
                  onClick={() => setCurrentStep(3)}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="text-center">
              <h2 className="font-bold text-lg text-customGray">Review your submission</h2>
              <p className="mt-4">Species: {selectedSpecies}</p>
              <p>Last Seen Location: {lastSeenLocation}</p>
              <div className="mt-6 flex justify-between gap-4">
                <Button
                  variant="outlined"
                  size="large"
                  width="48%"
                  height="48px"
                  style={{ fontSize: "16px", borderColor: "#2463EB", color: "#2463EB" }}
                  onClick={() => setCurrentStep(2)}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  width="48%"
                  height="48px"
                  style={{ fontSize: "16px", backgroundColor: "#2463EB" }}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
