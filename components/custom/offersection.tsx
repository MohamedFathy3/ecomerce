import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
const OfferSection = ({ offers, headLine, showAll }: { offers: any[], headLine: string, showAll?: boolean }) => {
  return (
    <section className="py-6 overflow-hidden">
      <div className="wrapper !px-8">
        <div className="w-11/12 mx-auto">
          <div className="flex justify-between gap-6 items-center mb-6">
            <h3 className="text-gray-700 font-semibold text-xl lg:text-3xl dark:text-slate-400">
              {headLine}
            </h3>
            {showAll && (
              <Link href="/offers">
                <Button variant="link" className="text-primary text-lg p-0 hover:underline">
                  عرض الكل
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="offer-cards-container w-10/11 sm:w-11/12 mx-auto">
          <Carousel opts={{ align: "start" }} className="w-10/12 sm:w-11/12 mx-auto">
            <CarouselContent className="-ms-1">
              {offers.map((offer) => (
                <CarouselItem
                  key={offer.id}
                  className="ps-1 basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
                >
                  <div className="p-2 flex justify-center sm:!block">
                    {/* Product Card Design */}
                    <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-3 h-full flex flex-col gap-3 relative transition-all duration-300 hover:shadow-md hover:border-red-200 dark:hover:border-red-800 group">
                      
                      {/* Product Image */}
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                        <Link href={`/product/${offer.product_id}`} className="block w-full h-full">
                          {offer.avatar ? (
                            <Image
                              src={offer.avatar}
                              alt={offer.title || "Offer image"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                          )}
                        </Link>

                        {/* Offer Badge */}
                        {offer.discount && (
                          <Badge className="absolute top-2 start-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                            عرض {offer.discount}%
                          </Badge>
                        )}
                      </div>

                      {/* Product Content */}
                      <div className="flex flex-col flex-grow space-y-3">
                        {/* Product Name */}
                        <Link href={`/product/${offer.product_id}`}>
                          <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-red-600 transition-colors min-h-[40px] group-hover:underline">
                            {offer.title}
                          </h3>
                        </Link>

                        {/* Description */}
                        {offer.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {offer.description}
                          </p>
                        )}

                        {/* Price Section - إذا كان في بيانات سعر */}
                        {(offer.price || offer.old_price) && (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col gap-1">
                              {offer.discount && offer.old_price ? (
                                <>
                                  <span className="line-through text-gray-500 text-xs">
                                    {offer.old_price} {offer.currency || "ج.م"}
                                  </span>
                                  <span className="text-foreground font-bold text-lg text-red-600">
                                    {offer.price} {offer.currency || "ج.م"}
                                  </span>
                                </>
                              ) : (
                                <span className="text-foreground font-bold text-lg">
                                  {offer.price} {offer.currency || "ج.م"}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Stock Status - إذا كان في بيانات كمية */}
                        {offer.quantity !== undefined && (
                          offer.quantity > 0 ? (
                            <div className="flex items-center gap-2 text-green-600 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              متوفر في المخزون
                            </div>
                          ) : (
                            <Badge variant="destructive" className="w-fit text-xs py-1 px-2">
                              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                              غير متوفر
                            </Badge>
                          )
                        )}

                        {/* Action Button */}
                        <div className="flex gap-2 mt-auto">
                          <Button
                            asChild
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-all duration-200"
                          >
                            <Link href={`/product/${offer.product_id}`}>
                              {offer.quantity > 0 ? "اشتري الآن" : "التفاصيل"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;