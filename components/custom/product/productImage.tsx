"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ImageOff } from "lucide-react";

const ProductImages = ({ images }: { images: string[] | null }) => {
  const [current, setCurrnet] = useState(0);
  if (!images || images.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-80 md:min-h-[400px] col-span-1 sm:col-span-2 border rounded-lg">
        <div className="relative flex-center flex-col">
          <ImageOff className="w-16 h-16 text-gray-400" />
          <div className="text-gray-500 mt-2">No images available</div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 h-full min-h-80 md:min-h-[400px] col-span-1 sm:col-span-2">
      <div className="relative flex-grow-1">
        <Image
          src={images[current]}
          fill
          alt={images[current]}
          className="object-contain object-center"
        />
      </div>
      {images.length > 0 && (
        <Carousel className=" h-2/10 max-h-14 w-10/12 mx-auto grid">
          <CarouselContent className="h-full gap-3 !m-0">
            {images.map((img, index) => (
              <CarouselItem
                className="basis-1/4 sm:basis-1/5 md:basis-1/4 lg:basis-1/5 relative aspect-square cursor-pointer"
                key={`p-image-${index}`}
              >
                <div
                  onClick={() => setCurrnet(index)}
                  className="w-full h-full"
                >
                  <Image
                    src={img}
                    fill
                    alt={img}
                    className={`object-contain object-center border  ${
                      index === current ? "border-amber-300" : "border-gray-100"
                    }`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      )}
    </div>
  );
};

export default ProductImages;
