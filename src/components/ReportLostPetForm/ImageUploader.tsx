import React from 'react';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import FormField from "./FormField";

interface ImageUploadProps {
  images: File[];
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onUpload, onRemove }) => {
  return (
    <FormField 
      label="Upload Pet Images" 
      name="images" 
      icon={<ImageIcon size={16} />}
      helpText="Upload multiple images"
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        className="w-full p-2 border rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-green-100 file:px-3 file:py-1 file:text-green-500"
      />

      {images.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">
            {images.length} {images.length === 1 ? "image" : "images"} uploaded
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((image, index) => (
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
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </FormField>
  );
};

export default ImageUpload;