import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../../components/ui/carousel";

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
    image: "/assets/adoptPet.jpg",
  },
  {
    id: 3,
    image: "/assets/petCarousel3.jpg",
  },
];

export default function Section1() {
  const [currentIndex, setCurrentIndex] = useState(0);
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
      (prevIndex) =>
        (prevIndex - 1 + carouselItems.length) % carouselItems.length
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
    <div className="relative w-full">
      {/* Carousel Component */}
      <Carousel>
        <CarouselContent>
          {carouselItems.map((item, index) => {
            if (index === currentIndex) {
              return (
                <CarouselItem key={item.id}>
                  <div
                    className="relative w-full h-[30vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh]"
                    {...swipeHandlers}
                  >
                    {/* Image component */}
                    <Image
                      src={item.image}
                      fill
                      className="object-cover"
                      priority
                      alt={""}
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    />
                  </div>
                </CarouselItem>
              );
            }
            return null;
          })}
        </CarouselContent>
      </Carousel>

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
