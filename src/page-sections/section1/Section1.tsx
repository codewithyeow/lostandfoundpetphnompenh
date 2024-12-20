import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

interface Pet {
  id: number;
  image: string;
}

const petData: Pet[] = [
  {
    id: 1,
    image: '/pets/bella.jpg', // Replace with actual image paths
  },
  {
    id: 2,
    image: '/pets/max.jpg',
  },
  {
    id: 3,
    image: '/pets/luna.jpg',
  },
];

export default function Section1() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % petData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + petData.length) % petData.length);
  };

  return (
    <section className="relative bg-white py-10">
      <div className="container mx-auto">
        {/* Display the Image Carousel */}
        <div className="relative w-full h-96">
          <div className="w-full h-full rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative">
            <Image
              src={petData[currentIndex].image}
              alt="Pet Image"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />

            {/* Text Section Overlaid on Image */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
              <h2 className="text-3xl font-bold text-center">We're here to help you find your pet</h2>
              <p className="text-lg mt-4 text-center">
                Petco Love Lost is a free and easy way to search 200K+ lost and found pets to help them return home.
              </p>
            </div>
          </div>

          {/* Previous and Next buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-r-lg hover:bg-gray-700 transition"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-l-lg hover:bg-gray-700 transition"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}
