import React from "react";
import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  images: File[];
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onUpload,
  onRemove,
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
        <ImageIcon className="mr-2 text-green-500" size={16} />
        Upload Pet Images
        <span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        multiple
        className="w-full p-2 border rounded-md file:mr-4 file:rounded-md file:border-0 file:bg-green-100 file:px-3 file:py-1 file:text-green-500"
      />
      <p className="text-xs text-gray-500">
        You can select multiple images at once
      </p>

      {images.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-2">
            Uploaded Images ({images.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded pet ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
