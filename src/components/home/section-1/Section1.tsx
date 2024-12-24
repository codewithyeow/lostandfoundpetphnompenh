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

const petData: Pet[] = [
  {
    id: 1,
    image: "/assets/petCarousel.jpg",
  },
  {
    id: 2,
    image: "/assets/petCarousel2.jpg",
  },
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % petData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + petData.length) % petData.length
    );
  };

  // const handleDotClick = (index: number) => {
  //   setCurrentIndex(index);
  // };

  // Handle swipe events
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

  return (
    <section className="relative w-full h-full bg-white">
      <div className="relative w-full h-[80vh]" {...swipeHandlers}>
        {/* Carousel with Embla */}
        <Carousel className="relative w-full h-full">
          <CarouselContent>
            <CarouselItem className="relative w-full h-[80vh]">
              <Image
                src={petData[currentIndex].image}
                alt={`Pet Image ${petData[currentIndex].id}`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </CarouselItem>
          </CarouselContent>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <SearchInput />
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-2xl font-bold text-center">
              {t("We are here to help you")}
            </h2>
            <p className="text-xl mt-4 text-center">{t("description")}</p>
          </div>

          {/* Navigation Buttons */}
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>

        {/* Dot Navigation */}
        {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {petData.map((_, index) => (
            <div
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                currentIndex === index ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}
