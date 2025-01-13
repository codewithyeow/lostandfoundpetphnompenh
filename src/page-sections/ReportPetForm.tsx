import React, { useState } from "react";
import Button from "../components/buttons/Button";
import { useRouter } from "next/navigation";
import { FaDog, FaMapMarkerAlt, FaImage } from "react-icons/fa";

interface SpeciesOption {
  value: string;
  label: string;
}

export default function ReportPetForm() {
  const router = useRouter();
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [location, setLocation] = useState<string>("");
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
    <div className="bg-[#E4EAEE] min-h-screen flex flex-col lg:px-8 px-4 w-full py-2 ">
      <div className="sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center font-bold leading-9 tracking-tight text-customGray lg:text-2xl text-lg">
          Report Found Pet - Step {currentStep} of 3
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto lg:max-w-2xl sm:w-full sm:max-w-sm">
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
                  Upload Pet Image
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

          {/* Combined Step 2 & 3: Location + Species Selection */}
          {currentStep === 2 && (
            <>
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Nearest Location
                </label>
              </div>
              <input
                type="text"
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                placeholder="Enter nearest location"
              />

              <div className="flex items-center mb-4 mt-6">
                <FaMapMarkerAlt className="mr-2 text-gray-500 lg:text-xl" />
                <label className="block lg:text-lg text-sm font-medium leading-6 text-balance text-customGray">
                  Location Found
                </label>
              </div>
              <input
                type="text"
                className="p-3 block w-full rounded-md border-0 bg-white/5 lg:py-3 py-1.5 shadow-sm ring-1 ring-inset ring-customGrey focus:ring-customGreen lg:text-lg sm:text-sm sm:leading-6"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location or use map"
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

              <div className="w-full mt-4">
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.795123456!2d106.79323951512696!3d-6.186462363203507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f132cd9ba219%3A0x4f69f6e8b5b7a3b7!2sGreen%20Lake%20City%2C%20Jakarta%20Barat!5e0!3m2!1sen!2sid!4v1673924553258!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

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
              <p>Location: {location}</p>
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
