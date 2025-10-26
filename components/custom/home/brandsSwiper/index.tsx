import React from "react";
import ProductCard from "../../product/productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

import BrandCard from "./brandCard";
import { Brand, category } from "@/types";

const BrandSwiper = ({
  headLine,
  subHeadign,
  highlight,
  items,
}: {
  headLine: string;
  subHeadign: string;
  highlight: string;
  items: Brand[] | category[];
}) => {
  return (
    <section className="py-6">
      <div className="wrapper !px-8">
        <div className="w-11/12 md:w-8/12 mx-auto ">
          <h3 className="text-gray-700 mx-auto text-center mb-4 font-semibold text-2xl lg:text-3xl dark:text-slate-400">
            <span>{headLine}</span>{" "}
            <span className="text-[#e7000b]">{highlight}</span>
          </h3>
          <p className="text-gray-500 font-medium lg:font-semibold text-base lg:text-lg dark:text-slate-500 text-center mb-6">
            {subHeadign}
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
          }}
          className="w-10/12 sm:w-11/12 mx-auto"
        >
          <CarouselContent className="-ms-1">
            {items.length > 0 &&
              items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="ps-1 basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 ms-2"
                >
                  <div className="p-1 flex-center sm:!block">
                    <BrandCard item={item} />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default BrandSwiper;
