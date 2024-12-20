import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable"; // Importing the swipeable hook

interface Pet {
  id: number;
  image: string;
}

const petData: Pet[] = [
  {
    id: 1,
    image: "/assets/petCarousel.jpg", // Replace with actual image paths
  },
  {
    id: 2,
    image: "/assets/petCarousel2.jpg", // Replace with actual image paths
  },
];

export default function Section1() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-swipe functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Auto-swipe every 3 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % petData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + petData.length) % petData.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle swipe events
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide, // Swipe left to go to the next slide
    onSwipedRight: prevSlide, // Swipe right to go to the previous slide
  });

  return (
    <section className="relative w-full h-auto bg-white">
      <div className="relative w-full h-[80vh]" {...swipeHandlers}>
        {/* Image Carousel Wrapper */}
        <div className="relative w-full h-full">
          <div className="w-full h-full overflow-hidden shadow-lg flex items-center justify-center relative">
            {/* Image */}
            <Image
              src={petData[currentIndex].image}
              alt="Pet Image"
              fill
              style={{ objectFit: "cover" }}
              className="w-full h-full"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
              <h2 className="text-4xl font-bold text-center">
                We're here to help you find your pet
              </h2>
              <p className="text-xl mt-4 text-center">
                Lost and Found is a free and easy way to search 200K+ lost and found pets to help them return home.
              </p>
            </div>
          </div>

          {/* Dot Navigation */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {petData.map((_, index) => (
              <div
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentIndex === index ? "bg-gray-800" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
