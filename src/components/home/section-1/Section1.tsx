import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/search-box/searchInput";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Adjust the path as necessary

interface Pet {
  id: number;
  image: string;
}

const carouselItems: Pet[] = [
  {
    id: 1,
    image: "/assets/lost_and_found_pets.jpg",
  },
  {
    id: 2,
    image: "/assets/lost-and-found-banner.jpg",
  },
  {
    id: 3,
    image: "/assets/petCarousel.jpg",
  },
  {
    id: 4,
    image: "/assets/petCarousel2.jpg",
  },
  {
    id: 5,
    image: "/assets/petCarousel.jpg",
  },
  {
    id: 6,
    image: "/assets/petCarousel2.jpg",
  }
];

export default function Section1() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const t = useTranslations("section1");

  // Auto-swipe functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle swipe events
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

  return (
    <div className='relative'>
    {/* Carousel Component */}
    <Carousel>
      <CarouselContent>
        {carouselItems.map((item, index) => {
          if (index === currentIndex) {
            return (
              <CarouselItem key={item.id}>
                <div
                  className='relative w-full sm:h-[60vh] md:h-[80vh] h-[45vh]' // Ensuring height adapts for different screen sizes
                  {...swipeHandlers}
                >
                  {/* Image that adjusts based on screen size */}
                  <Image
                    src={item.image}
                    layout='fill' // Fill the container completely while maintaining aspect ratio
                    className='w-full h-full object-cover' // Ensure both width and height fill the container
                    priority
                    quality={75}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw' alt={""}                  />
                </div>
              </CarouselItem>
            );
          }
          return null;
        })}
      </CarouselContent>
    </Carousel>
          {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <SearchInput />
          </div> */}

          {/* Text Overlay */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-2xl font-bold text-center">
              {t("We are here to help you")}
            </h2>
            <p className="text-xl mt-4 text-center">{t("description")}</p>
          </div> */}

          {/* Navigation Buttons */}
          {/* <CarouselPrevious />
          <CarouselNext /> */}

        {/* Dot Navigation */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {carouselItems.map((_, index) => (
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
  );
}
