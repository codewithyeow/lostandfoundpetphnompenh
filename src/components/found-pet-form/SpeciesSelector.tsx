import React, { useEffect, useState } from "react";
import { Dog, Cat, Bird, HelpCircle, Loader2 } from "lucide-react";
import { getSpecies } from "@server/actions/animal-action";

interface SpeciesOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SpeciesSelectorProps {
  selectedSpecies: string;
  onChange: (species: string) => void;
  speciesOptions: any;
}

export const SpeciesSelector: React.FC<SpeciesSelectorProps> = ({ selectedSpecies, onChange }) => {
  const [speciesOptions, setSpeciesOptions] = useState<SpeciesOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeciesData = async () => {
      try {
        setIsLoading(true);
        const response = await getSpecies();

        if (response.success && response.result) {
          const options = Object.entries(response.result).map(([id, name]) => {
            let icon = <HelpCircle className="mr-2" size={18} />;
            if (name.toLowerCase() === "dog") icon = <Dog className="mr-2" size={18} />;
            if (name.toLowerCase() === "cat") icon = <Cat className="mr-2" size={18} />;
            if (name.toLowerCase() === "bird") icon = <Bird className="mr-2" size={18} />;

            return {
              value: id,
              label: name,
              icon
            };
          });

          setSpeciesOptions(options);
        } else {
          setError(response.message || "Failed to load species");
        }
      } catch (err) {
        setError("An error occurred while fetching species");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeciesData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
          <Dog className="mr-2 text-green-500" size={16} />
          Species
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
          <Dog className="mr-2 text-green-500" size={16} />
          Species
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="text-red-500 text-sm p-2">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
        <Dog className="mr-2 text-green-500" size={16} />
        Species
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {speciesOptions.map((species) => (
          <button
            key={species.value}
            type="button"
            onClick={() => {
              console.log(`Species clicked: ${species.value}`); 
              onChange(species.value);  
            }}
            className={`
              flex items-center justify-center p-2 rounded-md text-sm transition-all 
              ${
                selectedSpecies === species.value
                  ? "bg-[#4eb7f0] text-white"
                  : "bg-white text-green-500 border border-green-500 hover:bg-green-50"
              }
            `}
          >
            {species.icon}
            {species.label}
          </button>
        ))}
      </div>
    </div>
  );
};
