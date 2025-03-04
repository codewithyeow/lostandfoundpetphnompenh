import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Image as ImageIcon, Dog, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@component/ui/card";

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export default function ReportFoundPetForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    petName: "",
    dateSeen: "",
    image: null as File | null,
    nearestLocation: "",
    locationFound: "",
    species: "",
  });

  const speciesOptions: SpeciesOption[] = [
    { value: "Dog", label: "Dog", icon: <Dog className="mr-2 text-[#4eb7f0]" /> },
    { value: "Cat", label: "Cat", icon: <Dog className="mr-2 text-[#4eb7f0]" /> },
    { value: "Bird", label: "Bird", icon: <Dog className="mr-2 text-[#4eb7f0]" /> },
    { value: "Other", label: "Other", icon: <Dog className="mr-2 text-[#4eb7f0]" /> },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/confirmation");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                  <Dog className="mr-2 text-[#4eb7f0]" />
                  Pet Name
                </label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  placeholder="Enter pet name"
                  className="w-full p-3 border rounded-lg focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                />
              </div>

              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                  <Calendar className="mr-2 text-[#4eb7f0]" />
                  Date Last Seen
                </label>
                <input
                  type="date"
                  name="dateSeen"
                  value={formData.dateSeen}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                />
              </div>

              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                  <ImageIcon className="mr-2 text-[#4eb7f0]" />
                  Upload Pet Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 border rounded-lg file:mr-4 file:rounded-full file:border-0 file:bg-[#4eb7f0]/10 file:px-4 file:py-2 file:text-[#4eb7f0]"
                />
                {formData.image && (
                  <div className="mt-4 relative w-full h-56 overflow-hidden rounded-lg">
                    <Image
                      src={URL.createObjectURL(formData.image)}
                      alt="Uploaded pet"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button" 
                onClick={() => setCurrentStep(2)} 
                className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                NEXT
                <Info className="ml-2" size={16} />
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                  <MapPin className="mr-2 text-[#4eb7f0]" />
                  Nearest Location
                </label>
                <input
                  type="text"
                  name="nearestLocation"
                  value={formData.nearestLocation}
                  onChange={handleInputChange}
                  placeholder="Enter nearest location"
                  className="w-full p-3 border rounded-lg focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                />
              </div>

              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                  <MapPin className="mr-2 text-[#4eb7f0]" />
                  Location Found
                </label>
                <input
                  type="text"
                  name="locationFound"
                  value={formData.locationFound}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="w-full p-3 border rounded-lg focus:ring-[#4eb7f0] focus:border-[#4eb7f0]"
                />
              </div>

              <div>
                <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                  <Dog className="mr-2 text-[#4eb7f0]" />
                  Species
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {speciesOptions.map((species) => (
                    <div
                      key={species.value}
                      onClick={() => setFormData(prev => ({ ...prev, species: species.value }))}
                      className={`
                        cursor-pointer flex items-center justify-center p-2 transition-all 
                        ${formData.species === species.value 
                          ? 'bg-[#4eb7f0] text-white' 
                          : 'bg-white text-[#4eb7f0] border-[#4eb7f0] hover:bg-[#4eb7f0]/10'
                        }
                      `}
                    >
                      {species.icon}
                      {species.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full mt-4">
                <div className="w-full h-64 sm:h-80 rounded-lg overflow-hidden">
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
            </div>
            
            <div className="flex justify-between mt-6 gap-4">
              <button
                type="button" 
                onClick={() => setCurrentStep(1)} 
                className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200"
              >
                PREVIOUS
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)} 
                className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                NEXT
                <Info className="ml-2" size={16} />
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-[#4eb7f0]">Review Submission</h2>
            
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Pet Name:</span>
                <span>{formData.petName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date Seen:</span>
                <span>{formData.dateSeen || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Species:</span>
                <span>{formData.species || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{formData.locationFound || 'Not provided'}</span>
              </div>
            </div>

            {formData.image && (
              <div className="relative w-full h-56 overflow-hidden rounded-lg">
                <Image
                  src={URL.createObjectURL(formData.image)}
                  alt="Uploaded pet"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            )}
            
            <div className="flex justify-between mt-6 gap-4">
              <button
                type="button" 
                onClick={() => setCurrentStep(2)} 
                className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200"
              >
                PREVIOUS
              </button>
              <button
                type="submit" 
                className="text-[#4eb7f0] border-2 border-[#4eb7f0] font-medium text-sm flex-grow py-3 rounded-full hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200"
              >
                SUBMIT
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f8f8fa] to-[#EFEEF1] min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-[#4eb7f0] text-xl font-bold">
            Report Found Pet - Step {currentStep} of 3
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}