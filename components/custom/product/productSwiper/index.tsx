import React from "react";
import ProductCard from "../productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductItem } from "@/types";

const ProductSwiper = ({
  headLine,
  products,
  showAll = false,
}: {
  headLine: string;
  products: ProductItem[] | null;
  showAll?: boolean;
}) => {
  return (
    <section className="py-6 overflow-hidden">
      <div className="wrapper !px-8">
        <div className="w-11/12 mx-auto">
          <div className="flex justify-between gap-6 items-center mb-4">
            <h3 className="text-gray-700 font-semibold text-xl lg:text-3xl dark:text-slate-400">
              {headLine}
            </h3>
            {showAll && (
              <Link href="/products">
                <Button variant="link" className="text-primary">
                  عرض الكل
                  <ArrowRight className="w-4 h-4 ms-1 auto-dir" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-10/11 sm:w-11/12 mx-auto"
        >
          <CarouselContent className="-ms-1">
            {products?.map((productItem, index) => (
              <CarouselItem
                key={`${productItem.id}-${headLine}-${index}`}
                className="ps-1 sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1 flex-center sm:!block h-full">
                  <ProductCard productItem={productItem} />
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

export default ProductSwiper;
