"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CarouselComponent = () => {
  const carouselItems = [
    {
      id: "765893",
      src: "//cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/streamingnewplayerdesk--x2.jpg",
      alt: "Streaming New Player",
    },
    {
      id: "765891",
      src: "//cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/bet9jablogjandesk--x2.jpg",
      alt: "Bet9ja Blog",
    },
    {
      id: "765897",
      src: "//cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/operafreedatarefreshdesk--x2.jpg",
      alt: "Opera Free Data",
    },
    {
      id: "799444",
      src: "//cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/catchtheboomdesk--x2.jpg",
      alt: "Catch the Boom",
    },
    {
      id: "782044",
      src: "//cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/biggestbooms--x2.jpg",
      alt: "Biggest Booms",
    },
    {
      id: "776845",
      src: "//cnt.bet9ja.com/img/promos/sportsbook/opt-in-promotion/updatedappdesk--x2.jpg",
      alt: "Updated App",
    },
  ];

  return (
    <div className="bg-black px-2">
      <Carousel
        className="w-full max-w-7xl mx-auto"
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
          containScroll: "trimSnaps",
        }}
        
      >
        <CarouselContent className="-ml-4">
          {carouselItems.map((item) => (
            <CarouselItem key={item.id} className="md:basis-3/4 lg:basis-1/2">
              <div className="h-full">
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-auto object-contain transform scale-110"
                    draggable="false"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
