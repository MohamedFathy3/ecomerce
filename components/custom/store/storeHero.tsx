import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonShare from "../buttonShare";
import { Pharmacy } from "@/types";
const StoreHero = ({ pharmacy }: { pharmacy: Pharmacy | null }) => {
  if (!pharmacy) {
    return (
      <section className="mb-12">
        <div className="text-center text-red-500">
          Pharmacy data not available
        </div>
      </section>
    );
  }

  const initials = pharmacy.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <section className="mb-24 relative">
      {/* Hero Image */}
      <div className="relative w-full aspect-video max-h-[50vh] overflow-hidden">
        <Image
          src="/images/uploads/store-hero.jpg"
          fill
          alt="Store Hero"
          className="object-cover"
        />
      </div>
      {/* Store Card Info */}
      <Card className="absolute bottom-0 w-11/12 max-w-xl translate-y-1/2 left-1/2 -translate-x-1/2 bg-background">
        <CardContent className="flex flex-row gap-4 relative">
          <Avatar className="w-18 h-18">
            <AvatarImage src={pharmacy.image} />
            <AvatarFallback>{initials || "Store"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-grow">
            <h1 className="text-lg font-semibold text-primary">
              {pharmacy.name}
            </h1>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="ml-2">
                  {pharmacy.phone || "No phone number available"}
                </span>
              </p>

              <p className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="ml-2">
                  {pharmacy.address || "No address available"}
                </span>
              </p>

              {/* <p className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="ml-2">
                  {pharmacy. || "No hours available"}
                </span>
              </p> */}

              <span className=" px-3 py-0.5 font-medium bg-green-100 text-green-800 border border-green-200 rounded-full">
                Open Now
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3">
              <ButtonShare />
              <Button variant="outline">Contact</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default StoreHero;
